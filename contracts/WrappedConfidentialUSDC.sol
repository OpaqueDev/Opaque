// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20ToERC7984Wrapper} from "@iexec-nox/nox-confidential-contracts/contracts/token/extensions/ERC20ToERC7984Wrapper.sol";
import {ERC7984} from "@iexec-nox/nox-confidential-contracts/contracts/token/ERC7984.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract WrappedConfidentialUSDC is ERC20ToERC7984Wrapper {
    constructor()
        ERC20ToERC7984Wrapper(
            IERC20(0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d) // Circle USDC on Arbitrum Sepolia
        )
        ERC7984("Wrapped Confidential USDC", "wcUSDC", "")
    {}
}
