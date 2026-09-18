import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }) {
  const [activeTab, setActiveTab] = useState("camera"); // 'camera' | 'file'
  const [cameras, setCameras] = useState([]);
  const [currentCameraId, setCurrentCameraId] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const html5QrCodeRef = useRef(null);
  const fileInputRef = useRef(null);
  const scannerContainerId = "qr-camera-stream-box";

  // Âm thanh bíp khi quét trúng mã thành công
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880; // La note
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.15);
    } catch {
      // AudioContext có thể bị chặn trên một số trình duyệt
    }
  };

  // Khởi động Camera
  const startCamera = async (cameraIdToUse) => {
    setCameraError(null);
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerContainerId);
      }

      // Nếu đang chạy thì dừng trước
      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }

      const cameraConfig = cameraIdToUse
        ? { deviceId: { exact: cameraIdToUse } }
        : { facingMode: "environment" }; // Mặc định camera sau của điện thoại

      await html5QrCodeRef.current.start(
        cameraConfig,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        (decodedText) => {
          handleDetectedCode(decodedText);
        },
        () => {
          // Frame không có QR - bỏ qua
        }
      );

      setIsScanning(true);
    } catch (err) {
      console.warn("Lỗi khởi tạo camera:", err);
      setCameraError(
        "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập hoặc thử chuyển sang tính năng 'Tải ảnh vé'."
      );
      setIsScanning(false);
    }
  };

  // Dừng Camera an toàn để giải phóng phần cứng
  const stopCamera = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }
    } catch (err) {
      console.warn("Lỗi khi dừng camera:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Lấy danh sách Camera khả dụng khi mở modal
  useEffect(() => {
    if (!isOpen) return;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          // Ưu tiên camera sau (back/environment camera)
          const backCam = devices.find(
            (c) =>
              c.label.toLowerCase().includes("back") ||
              c.label.toLowerCase().includes("sau") ||
              c.label.toLowerCase().includes("environment")
          );
          const initialId = backCam ? backCam.id : devices[0].id;
          setCurrentCameraId(initialId);

          if (activeTab === "camera") {
            startCamera(initialId);
          }
        } else {
          setCameraError("Không tìm thấy camera nào trên thiết bị của bạn.");
        }
      })
      .catch((err) => {
        console.warn("Lỗi lấy danh sách camera:", err);
        setCameraError(
          "Vui lòng cấp quyền Camera trên trình duyệt để quét trực tiếp, hoặc chọn tab 'Tải ảnh vé'."
        );
      });

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Đổi Camera (Trước / Sau)
  const handleSwitchCamera = async () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === currentCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    const nextCamId = cameras[nextIndex].id;
    setCurrentCameraId(nextCamId);
    await startCamera(nextCamId);
  };

  // Xử lý khi quét trúng mã hợp lệ
  const handleDetectedCode = (rawText) => {
    playBeep();
    stopCamera();

    let cleanCode = rawText.trim();
    // Bóc tách nếu mã có dạng URL hoặc prefix
    if (cleanCode.includes("/")) {
      const parts = cleanCode.split("/");
      cleanCode = parts[parts.length - 1];
    }
    if (cleanCode.startsWith("#")) {
      cleanCode = cleanCode.substring(1);
    }

    toast.success(`Đã quét thành công mã vé: ${cleanCode}`);
    onScanSuccess && onScanSuccess(cleanCode);
    onClose();
  };

  // Quét mã từ File ảnh người dùng tải lên
  const handleFileUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsProcessingFile(true);
    const toastId = toast.loading("Đang phân tích mã QR từ ảnh...");

    try {
      const html5Qr = new Html5Qrcode("qr-file-processor-box");
      const decodedText = await html5Qr.scanFile(file, true);

      toast.dismiss(toastId);
      handleDetectedCode(decodedText);
    } catch (err) {
      console.warn("Không tìm thấy QR trong ảnh:", err);
      toast.error(
        "Không thể nhận diện mã QR trong ảnh này. Vui lòng chọn ảnh chụp rõ nét hơn hoặc nhập mã thủ công.",
        { id: toastId, duration: 4000 }
      );
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="qr-scanner-backdrop" onClick={onClose}>
      <div
        className="qr-scanner-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        {/* Header Modal */}
        <div className="qs-header">
          <div className="qs-title-wrap">
            <div className="qs-icon">
              <i className="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <h3 className="qs-title">Quét Mã QR Tra Cứu Vé</h3>
              <p className="qs-sub">
                Đưa mã vé vào camera hoặc tải ảnh chụp vé lên
              </p>
            </div>
          </div>
          <button
            type="button"
            className="qs-close-btn"
            onClick={onClose}
            aria-label="Đóng"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Chuyển Tab: Camera vs Tải Ảnh */}
        <div className="qs-tabs">
          <button
            type="button"
            className={`qs-tab-btn ${activeTab === "camera" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("camera");
              startCamera(currentCameraId);
            }}
          >
            <i className="fa-solid fa-camera"></i> Quét Trực Tiếp (Camera)
          </button>
          <button
            type="button"
            className={`qs-tab-btn ${activeTab === "file" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("file");
              stopCamera();
            }}
          >
            <i className="fa-solid fa-image"></i> Tải Ảnh Chụp Vé
          </button>
        </div>

        {/* Nội dung Tab 1: Camera Scanner */}
        {activeTab === "camera" && (
          <div className="qs-camera-body">
            {cameraError ? (
              <div className="qs-error-notice">
                <i className="fa-solid fa-triangle-exclamation"></i>
                <p>{cameraError}</p>
                <button
                  type="button"
                  className="qs-btn-retry"
                  onClick={() => startCamera(currentCameraId)}
                >
                  <i className="fa-solid fa-rotate"></i> Thử lại quyền Camera
                </button>
              </div>
            ) : (
              <div className="qs-stream-wrapper">
                <div id={scannerContainerId} className="qs-video-box"></div>

                {/* Khung ngắm giả lập laser scan */}
                {isScanning && (
                  <div className="qs-reticle-overlay">
                    <div className="qs-reticle-frame">
                      <div className="qs-laser-line"></div>
                      <span className="qs-corner tl"></span>
                      <span className="qs-corner tr"></span>
                      <span className="qs-corner bl"></span>
                      <span className="qs-corner br"></span>
                    </div>
                    <p className="qs-scan-instruction">
                      Căn chỉnh mã QR vào giữa khung hình
                    </p>
                  </div>
                )}
              </div>
            )}

            {cameras.length > 1 && !cameraError && (
              <div className="qs-controls-row">
                <button
                  type="button"
                  className="qs-switch-cam-btn"
                  onClick={handleSwitchCamera}
                >
                  <i className="fa-solid fa-camera-rotate"></i> Đổi Camera (
                  {cameras.length} camera)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Nội dung Tab 2: Upload Ảnh File */}
        {activeTab === "file" && (
          <div className="qs-file-body">
            {/* Box xử lý ẩn của thư viện */}
            <div id="qr-file-processor-box" style={{ display: "none" }}></div>

            <div
              className="qs-upload-dropzone"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
              <div className="qs-drop-icon">
                <i className="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h4 className="qs-drop-title">
                {isProcessingFile
                  ? "Đang quét mã QR từ ảnh..."
                  : "Chọn hoặc Kéo thả ảnh vé tại đây"}
              </h4>
              <p className="qs-drop-sub">
                Hỗ trợ ảnh định dạng JPG, PNG, WEBP chụp từ điện thoại hoặc màn hình
              </p>
              <button
                type="button"
                className="qs-btn-choose-file"
                disabled={isProcessingFile}
              >
                <i className="fa-regular fa-folder-open"></i> Chọn tệp ảnh từ máy
              </button>
            </div>
          </div>
        )}

        {/* Footer hướng dẫn */}
        <div className="qs-footer">
          <span className="qs-footer-hint">
            <i className="fa-solid fa-lightbulb text-amber-500"></i> Mã vé du lịch
            TravelGo có tiền tố bắt đầu bằng <strong>BKG-*********</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
