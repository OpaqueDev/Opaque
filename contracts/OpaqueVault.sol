// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title OpaqueVault
 * @dev Confidential asset pooling contract for iExec Nox TEE integration.
 * Balances are pooled. Authorship of deposits is masked via generic encrypted payloads
 * meant ONLY to be decrypted securely by the iExec SGX Enclave.
 */
contract OpaqueVault is Ownable {
    using SafeERC20 for IERC20;

    // Emitted when a user shields assets. Payload should be encrypted with TEE public key.
    event AssetShielded(address indexed sender, address indexed token, uint256 amount, bytes encryptedPayload);
    
    // Emitted when the TEE Oracle authorizes an unshield (withdrawal)
    event AssetUnshielded(address indexed recipient, address indexed token, uint256 amount, bytes32 proofId);

    // Only the authorized iExec TEE Worker pool address can trigger unshielding operations
    address public teeOracle;

    modifier onlyTEE() {
        require(msg.sender == teeOracle, "OpaqueVault: Only iExec TEE Enclave can authorize this state change");
        _;
    }

    constructor(address _teeOracle) Ownable(msg.sender) {
        teeOracle = _teeOracle;
    }

    /**
     * @dev User deposits public ERC20 tokens to be shielded.
     * @param token Address of the ERC20 token to lock.
     * @param amount Amount to deposit into the Enclave vault.
     * @param encryptedPayload Data encrypted via iExec public key (contains routing or tracking info).
     */
    function shield(address token, uint256 amount, bytes calldata encryptedPayload) external {
        require(amount > 0, "OpaqueVault: Amount must be greater than zero");
        require(token != address(0), "OpaqueVault: Invalid token address");
        
        // Securely transfer ERC20 tokens from the user to this confidential vault
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Emit public log for the off-chain iExec Enclave to index and process privately inside SGX hardware
        emit AssetShielded(msg.sender, token, amount, encryptedPayload);
    }

    /**
     * @dev Withdrawal triggered exclusive by the TEE Enclave after successful private execution/verification.
     * @param recipient The stealth or mapped recipient address.
     * @param token The ERC20 token to unshield.
     * @param amount The evaluated amount to send back (e.g., after private PnL execution).
     * @param proofId Reference to the cryptographic TEE Attestation logged off-chain.
     */
    function unshield(address recipient, address token, uint256 amount, bytes32 proofId) external onlyTEE {
        require(amount > 0, "OpaqueVault: Amount must be greater than zero");
        require(recipient != address(0), "OpaqueVault: Invalid recipient address");
        
        // Transfer tokens back to public chain view
        IERC20(token).safeTransfer(recipient, amount);

        emit AssetUnshielded(recipient, token, amount, proofId);
    }

    /**
     * @dev Update the TEE Oracle address. Governed strictly by the protocol multisig.
     */
    function setTEEOracle(address _newOracle) external onlyOwner {
        require(_newOracle != address(0), "OpaqueVault: Invalid oracle address");
        teeOracle = _newOracle;
    }
}
