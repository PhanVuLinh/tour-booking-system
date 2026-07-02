package com.lvtn.java.service.impl;

import com.lvtn.java.domain.entity.Account;
import com.lvtn.java.domain.entity.Role;
import com.lvtn.java.dto.account.AccountRequest;
import com.lvtn.java.dto.account.AccountResponse;
import com.lvtn.java.repository.AccountRepository;
import com.lvtn.java.repository.RoleRepository;
import com.lvtn.java.service.AccountService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final RoleRepository roleRepository;
    private final ModelMapper mapper;

    private AccountResponse mapToResponse(Account account) {
        AccountResponse response = mapper.map(account, AccountResponse.class);
        if (account.getRole() != null) {
            response.setRoleId(account.getRole().getId());
            response.setRoleName(account.getRole().getName());
        }
        return response;
    }

    private boolean isAdmin(Integer accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy thông tin người thực hiện"));
        return account.getRole() != null && account.getRole().getName().toLowerCase().contains("admin");
    }
    private void checkAdminRole(Integer accountId) {
        if (!isAdmin(accountId)) {
            throw new RuntimeException("Từ chối truy cập: Chỉ Quản trị viên (Admin) mới có quyền thực hiện hành động này!");
        }
    }

    @Override
    public List<AccountResponse> findAllActive() {
        return accountRepository.findByDeletedFalse().stream().map(this::mapToResponse).toList();
    }

    @Override
    public List<AccountResponse> findAllTrash() {
        return accountRepository.findByDeletedTrue().stream().map(this::mapToResponse).toList();
    }

    @Override
    public AccountResponse findById(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + id));
        return mapToResponse(account);
    }

    @Override
    @Transactional
    public AccountResponse create(AccountRequest request, Integer creatorId) {
        checkAdminRole(creatorId);

        if (accountRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }

        mapper.typeMap(AccountRequest.class, Account.class).addMappings(m -> m.skip(Account::setRole));
        Account account = mapper.map(request, Account.class);

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chức vụ (Role) với ID: " + request.getRoleId()));
            account.setRole(role);
        }

        if (account.getStatus() == null) account.setStatus("active");
        account.setCreatedBy(creatorId);
        account.setUpdatedBy(creatorId);

        return mapToResponse(accountRepository.save(account));
    }

    @Override
    @Transactional
    public AccountResponse update(Integer id, AccountRequest request, String avatarUrl, Integer updaterId) {
        boolean isSelfUpdate = id.equals(updaterId);
        boolean hasAdminRole = isAdmin(updaterId);

        if (!isSelfUpdate && !hasAdminRole) {
            throw new RuntimeException("Từ chối truy cập!");
        }

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản"));

        if (request.getFullName() != null) account.setFullName(request.getFullName());
        if (request.getEmail() != null) {
            if (!account.getEmail().equals(request.getEmail())
                    && accountRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email đã tồn tại!");
            }
            account.setEmail(request.getEmail());
        }
        if (request.getPhone() != null) account.setPhone(request.getPhone());
        if (request.getJobTitle() != null) account.setJobTitle(request.getJobTitle());

        // ✅ Dùng URL từ controller (đã upload xong), giữ ảnh cũ nếu không có file mới
        if (avatarUrl != null && !avatarUrl.isBlank()) {
            account.setAvatar(avatarUrl);
        } else if (request.getAvatar() != null) {
            account.setAvatar(request.getAvatar());
        }

        if (hasAdminRole) {
            if (request.getRoleId() != null) {
                Role role = roleRepository.findById(request.getRoleId())
                        .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy role"));
                account.setRole(role);
            }
            if (request.getStatus() != null) account.setStatus(request.getStatus());
        }

        account.setUpdatedBy(updaterId);
        return mapToResponse(accountRepository.save(account));
    }

    @Override
    @Transactional
    public void delete(Integer id, Integer deleterId) {
        checkAdminRole(deleterId);

        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + id));

        account.setDeleted(true);
        account.setDeletedAt(LocalDateTime.now());
        account.setDeletedBy(deleterId);
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void restore(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + id));

        account.setDeleted(false);
        account.setDeletedAt(null);
        account.setDeletedBy(null);
        accountRepository.save(account);
    }

    @Override
    @Transactional
    public void hardDelete(Integer id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tài khoản với ID: " + id));
        accountRepository.delete(account);
    }
}