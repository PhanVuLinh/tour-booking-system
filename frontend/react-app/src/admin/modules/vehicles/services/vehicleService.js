let mockVehicles = [
  {
    id: 1,
    name: "Xe khách Hoàng Long 45 chỗ",
    vehicleType: "Xe khách",
    createdBy: "Admin",
    updatedBy: null,
    createdAt: "2026-01-10 08:00:00",
    updatedAt: "2026-01-10 08:00:00",
  },
  {
    id: 2,
    name: "Máy bay VietJet VJ123",
    vehicleType: "Máy bay",
    createdBy: "Admin",
    updatedBy: null,
    createdAt: "2026-02-05 09:30:00",
    updatedAt: "2026-02-05 09:30:00",
  },
  {
    id: 3,
    name: "Tàu nhanh SE3 Bắc-Nam",
    vehicleType: "Tàu hỏa",
    createdBy: "Admin",
    updatedBy: "Nhân viên A",
    createdAt: "2026-02-20 10:00:00",
    updatedAt: "2026-03-01 14:00:00",
  },
  {
    id: 4,
    name: "Du thuyền Hạ Long Star",
    vehicleType: "Tàu thủy",
    createdBy: "Admin",
    updatedBy: null,
    createdAt: "2026-03-01 11:00:00",
    updatedAt: "2026-03-01 11:00:00",
  },
];

let mockDeletedVehicles = [];

export const vehicleService = {
  getAllActive: async () => {
    return [...mockVehicles];
  },

  getAllTrash: async () => {
    return [...mockDeletedVehicles];
  },

  create: async (data) => {
    const now = new Date().toLocaleString("vi-VN");
    const newVehicle = {
      id: Date.now(),
      name: data.name,
      vehicleType: data.vehicleType,
      createdBy: "Admin",
      updatedBy: null,
      createdAt: now,
      updatedAt: now,
    };
    mockVehicles.push(newVehicle);
    return newVehicle;
  },

  update: async (id, data) => {
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Không tìm thấy phương tiện");
    
    mockVehicles[index] = {
      ...mockVehicles[index],
      name: data.name,
      vehicleType: data.vehicleType,
      updatedBy: "Admin",
      updatedAt: new Date().toLocaleString("vi-VN"),
    };
    return mockVehicles[index];
  },

  softDelete: async (id) => {
    const index = mockVehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Không tìm thấy phương tiện");

    const vehicle = mockVehicles.splice(index, 1)[0];
    mockDeletedVehicles.push({
      ...vehicle,
      deletedBy: "Admin",
      deletedAt: new Date().toLocaleString("vi-VN"),
    });
  },

  restore: async (id) => {
    const index = mockDeletedVehicles.findIndex((v) => v.id === id);
    if (index === -1) throw new Error("Không tìm thấy phương tiện trong thùng rác");

    const { deletedBy, deletedAt, ...vehicle } = mockDeletedVehicles.splice(index, 1)[0];
    mockVehicles.push(vehicle);
  },

  hardDelete: async (id) => {
    mockDeletedVehicles = mockDeletedVehicles.filter((v) => v.id !== id);
  },
};