/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Vesting, VestingInterface } from "../Vesting";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "nftAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8[]",
        name: "tokenIds",
        type: "uint8[]",
      },
    ],
    name: "NFTsClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "admin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint8[]",
        name: "tokenIds",
        type: "uint8[]",
      },
    ],
    name: "NFTsReclaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "vestedNFTs",
        type: "uint256",
      },
    ],
    name: "UserDataSet",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [],
    name: "VestingStarted",
    type: "event",
  },
  {
    inputs: [],
    name: "boughtNFTs",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "numNFTs",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "numDays",
        type: "uint256",
      },
    ],
    name: "calculateReleasePeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "claim",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "cliffPeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getPauseData",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "pausedTime",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "timeOffset",
            type: "uint256",
          },
        ],
        internalType: "struct Vesting.PausedData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserData",
    outputs: [
      {
        components: [
          {
            internalType: "uint8",
            name: "size",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "bitShift",
            type: "uint8",
          },
          {
            internalType: "uint8",
            name: "withdrawnCount",
            type: "uint8",
          },
          {
            internalType: "uint128",
            name: "vestedNFTs",
            type: "uint128",
          },
        ],
        internalType: "struct Vesting.UserData",
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "numNFTsReleased",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pauseVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "reclaimNFTs",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "releasePeriod",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint128",
        name: "vestedNFTs",
        type: "uint128",
      },
    ],
    name: "setUser",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint128[]",
        name: "vestedNFTs",
        type: "uint128[]",
      },
    ],
    name: "setUsers",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "cliffPeriod_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "releasePeriod_",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "securityPeriod",
        type: "uint256",
      },
    ],
    name: "startVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "unpauseVesting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingEndTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingNFT",
    outputs: [
      {
        internalType: "contract IERC721",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingStartTime",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "vestingStarted",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405162001ad138038062001ad18339810160408190526100319161009b565b61003a3361004b565b6001600160a01b03166080526100cb565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100ad57600080fd5b81516001600160a01b03811681146100c457600080fd5b9392505050565b6080516119c76200010a600039600081816101410152818161051301528181610af101528181610e0a01528181610ef50152610fa101526119c76000f3fe608060405234801561001057600080fd5b50600436106101375760003560e01c806386fab45e116100b8578063bac932fa1161007c578063bac932fa146102a2578063c3cbebdb146102b5578063f2fde38b146102bd578063f998c8e8146102d0578063fc08141e146102f4578063ffc9896b1461030757600080fd5b806386fab45e146102075780638da5cb5b1461021057806393294adf14610221578063a8660a7814610291578063b40e23931461029a57600080fd5b80633ec0c1b9116100ff5780633ec0c1b9146101c857806348d5a689146101db5780634e71d92d146101ee57806363ef1627146101f6578063715018a6146101ff57600080fd5b80630f98977d1461013c578063207638e8146101805780632f661946146101a1578063314759b4146101aa57806331d8c714146101b3575b600080fd5b6101637f000000000000000000000000000000000000000000000000000000000000000081565b6040516001600160a01b0390911681526020015b60405180910390f35b61019361018e3660046114c8565b610364565b604051908152602001610177565b61019360025481565b61019360055481565b6101c66101c13660046114e5565b6104aa565b005b6101c66101d636600461152e565b610774565b6101c66101e9366004611640565b6107ee565b6101c661090d565b61019360035481565b6101c6610c76565b61019360045481565b6000546001600160a01b0316610163565b61027661022f3660046114c8565b6040805180820190915260008082526020820152506001600160a01b0316600090815260086020908152604091829020825180840190935280548352600101549082015290565b60408051825181526020928301519281019290925201610177565b61019360015481565b6101c6610cac565b6101c66102b03660046114c8565b610d7a565b6101c6611084565b6101c66102cb3660046114c8565b611124565b6000546102e490600160a01b900460ff1681565b6040519015158152602001610177565b610193610302366004611702565b6111bf565b61031a6103153660046114c8565b611245565b6040516101779190600060808201905060ff835116825260ff602084015116602083015260ff60408401511660408301526001600160801b03606084015116606083015292915050565b60006001544210158015610379575060045442105b61039e5760405162461bcd60e51b815260040161039590611724565b60405180910390fd5b6001600160a01b0382166000908152600860209081526040808320815180830190925280548252600190810154928201839052549092916103de9161176a565b82519091506000906103f057426103f3565b82515b90508060025483610404919061176a565b106104515760405162461bcd60e51b815260206004820152601760248201527f4e6f7420616674657220636c69666620706572696f64210000000000000000006044820152606401610395565b6001600160a01b03851660009081526007602052604081205460035460ff909116919061047e8585611782565b6104889190611799565b90508082101561049e575093506104a592505050565b9450505050505b919050565b6000546001600160a01b031633146104d45760405162461bcd60e51b8152600401610395906117bb565b600054600160a01b900460ff16156104fe5760405162461bcd60e51b8152600401610395906117f0565b6040516370a0823160e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610562573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105869190611827565b6064146105f05760405162461bcd60e51b815260206004820152603260248201527f4e465420636f6c6c656374696f6e206d757374206265206d696e74656420746f6044820152712076657374696e6720636f6e74726163742160701b6064820152608401610395565b8315806105fc57504284115b61063d5760405162461bcd60e51b8152602060048201526012602482015271496e76616c69642074696d657374616d702160701b6044820152606401610395565b6000821161068d5760405162461bcd60e51b815260206004820152601760248201527f496e76616c69642072656c6561736520706572696f64210000000000000000006044820152606401610395565b6005546106ea5760405162461bcd60e51b815260206004820152602560248201527f4e6f20757365722076657374696e6720696e666f726d6174696f6e2070726f76604482015264696465642160d81b6064820152608401610395565b6002839055600382905583156107005783610702565b425b6001556006546000906107159084611840565b90508181600154610726919061176a565b610730919061176a565b6004556000805460ff60a01b1916600160a01b1781556040517faefb5f3f7a70c1101c87eaf0cf9d87d04788f67e3890db9ed94440d26afc64ba9190a15050505050565b6000546001600160a01b0316331461079e5760405162461bcd60e51b8152600401610395906117bb565b600054600160a01b900460ff16156107c85760405162461bcd60e51b8152600401610395906117f0565b60006107d483836112cc565b60ff1690506006548111156107e95760068190555b505050565b6000546001600160a01b031633146108185760405162461bcd60e51b8152600401610395906117bb565b600054600160a01b900460ff16156108425760405162461bcd60e51b8152600401610395906117f0565b805182511461088c5760405162461bcd60e51b8152602060048201526016602482015275496e76616c6964206172726179206c656e677468732160501b6044820152606401610395565b6000805b83518110156108fb5760006108d78583815181106108b0576108b061185f565b60200260200101518584815181106108ca576108ca61185f565b60200260200101516112cc565b60ff169050828111156108e8578092505b50806108f381611875565b915050610890565b506006548111156107e9576006555050565b6001544210158015610920575060045442105b61093c5760405162461bcd60e51b815260040161039590611724565b600061094733611245565b805190915060ff1661098f5760405162461bcd60e51b81526020600482015260116024820152704e6f204e46547320746f20636c61696d2160781b6044820152606401610395565b806000015160ff16816040015160ff1614156109e65760405162461bcd60e51b81526020600482015260166024820152754e6f204e465473206c65667420746f20636c61696d2160501b6044820152606401610395565b60006109f133610364565b9050816040015160ff168111610a555760405162461bcd60e51b815260206004820152602360248201527f5761697420666f722072656d61696e696e67204e46547320746f2072656c656160448201526273652160e81b6064820152608401610395565b602082015160408301516060840151309291906001600160801b031660ff8084169190911c90600090610a8a90841687611782565b67ffffffffffffffff811115610aa257610aa2611563565b604051908082528060200260200182016040528015610acb578160200160208202803683370190505b50905060005b868460ff161015610bfb5760018084161415610bd9576001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000166323b872dd8733610b23896001611890565b6040516001600160e01b031960e086901b1681526001600160a01b03938416600482015292909116602483015260ff166044820152606401600060405180830381600087803b158015610b7557600080fd5b505af1158015610b89573d6000803e3d6000fd5b50505050846001610b9a9190611890565b828281518110610bac57610bac61185f565b60ff90921660209283029190910190910152610bc960018261176a565b9050610bd6600185611890565b93505b610be4600186611890565b94506001836001600160801b0316901c9250610ad1565b3360008181526007602052604090819020805460ff8981166101000261ff0019918a1662010000029190911662ffff001990921691909117179055517f093cca7b99bb835c1ce521835f38ed7995acf9930280a20d0517b41e69dad17291610c649185906118f3565b60405180910390a15050505050505050565b6000546001600160a01b03163314610ca05760405162461bcd60e51b8152600401610395906117bb565b610caa6000611463565b565b6001544210158015610cbf575060045442105b610cdb5760405162461bcd60e51b815260040161039590611724565b33600090815260086020526040902054610d375760405162461bcd60e51b815260206004820152601f60248201527f56657374696e67206973206e6f742070617573656420666f72207573657221006044820152606401610395565b3360009081526008602052604090208054421115610d74578054610d5b9042611782565b816001016000828254610d6e919061176a565b90915550505b60009055565b6000546001600160a01b03163314610da45760405162461bcd60e51b8152600401610395906117bb565b600454421015610def5760405162461bcd60e51b815260206004820152601660248201527556657374696e6720686173206e6f7420656e6465642160501b6044820152606401610395565b6040516370a0823160e01b81523060048201819052906000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa158015610e59573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610e7d9190611827565b67ffffffffffffffff811115610e9557610e95611563565b604051908082528060200260200182016040528015610ebe578160200160208202803683370190505b509050600060015b60648160ff1611611042576040516331a9108f60e11b815260ff821660048201526001600160a01b03808616917f000000000000000000000000000000000000000000000000000000000000000090911690636352211e90602401602060405180830381865afa158015610f3e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610f62919061191f565b6001600160a01b03161415611030576040516323b872dd60e01b81526001600160a01b038581166004830152868116602483015260ff831660448301527f000000000000000000000000000000000000000000000000000000000000000016906323b872dd90606401600060405180830381600087803b158015610fe557600080fd5b505af1158015610ff9573d6000803e3d6000fd5b50505050808383815181106110105761101061185f565b60ff9092166020928302919091019091015261102d60018361176a565b91505b8061103a8161193c565b915050610ec6565b507f69e13f8e5230d093f34ed73afddaeb89c18c91c44d5ab61695f49fd48f8a56d43385846040516110769392919061195c565b60405180910390a150505050565b6001544210158015611097575060045442105b6110b35760405162461bcd60e51b815260040161039590611724565b33600090815260086020526040902054156111105760405162461bcd60e51b815260206004820152601b60248201527f56657374696e672069732070617573656420666f7220757365722100000000006044820152606401610395565b336000908152600860205260409020429055565b6000546001600160a01b0316331461114e5760405162461bcd60e51b8152600401610395906117bb565b6001600160a01b0381166111b35760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610395565b6111bc81611463565b50565b600080831180156111d05750600082115b6112265760405162461bcd60e51b815260206004820152602160248201527f52656c6561736520706172616d73206d7573742062652031206f72206d6f72656044820152602160f81b6064820152608401610395565b826112348362015180611840565b61123e9190611799565b9392505050565b604080516080810182526000808252602082018190529181018290526060810191909152506001600160a01b03166000908152600760209081526040918290208251608081018452905460ff8082168352610100820481169383019390935262010000810490921692810192909252630100000090046001600160801b0316606082015290565b6000600554826001600160801b0316166000146113375760405162461bcd60e51b815260206004820152602360248201527f4e6f206475706c6963617465204e4654206f776e65727368697020616c6c6f7760448201526265642160e81b6064820152608401610395565b60008281805b6001600160801b0383161561139357600180841614156113715760ff8216611363578091505b61136e600185611890565b93505b61137c600182611890565b90506001836001600160801b0316901c925061133d565b506040805160808101825260ff8086168252928316602080830191825260008385018181526001600160801b03808c16606087018181526001600160a01b038f1685526007909552969092209451855494519151935190921663010000000272ffffffffffffffffffffffffffffffff0000001993881662010000029390931672ffffffffffffffffffffffffffffffffff0000199188166101000261ffff1990951692909716919091179290921791909116939093179290921790915560058054909117905550905092915050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b03811681146111bc57600080fd5b6000602082840312156114da57600080fd5b813561123e816114b3565b600080600080608085870312156114fb57600080fd5b5050823594602084013594506040840135936060013592509050565b80356001600160801b03811681146104a557600080fd5b6000806040838503121561154157600080fd5b823561154c816114b3565b915061155a60208401611517565b90509250929050565b634e487b7160e01b600052604160045260246000fd5b604051601f8201601f1916810167ffffffffffffffff811182821017156115a2576115a2611563565b604052919050565b600067ffffffffffffffff8211156115c4576115c4611563565b5060051b60200190565b600082601f8301126115df57600080fd5b813560206115f46115ef836115aa565b611579565b82815260059290921b8401810191818101908684111561161357600080fd5b8286015b848110156116355761162881611517565b8352918301918301611617565b509695505050505050565b6000806040838503121561165357600080fd5b823567ffffffffffffffff8082111561166b57600080fd5b818501915085601f83011261167f57600080fd5b8135602061168f6115ef836115aa565b82815260059290921b840181019181810190898411156116ae57600080fd5b948201945b838610156116d55785356116c6816114b3565b825294820194908201906116b3565b965050860135925050808211156116eb57600080fd5b506116f8858286016115ce565b9150509250929050565b6000806040838503121561171557600080fd5b50508035926020909101359150565b6020808252601690820152754e6f7420696e2076657374696e6720706572696f642160501b604082015260600190565b634e487b7160e01b600052601160045260246000fd5b6000821982111561177d5761177d611754565b500190565b60008282101561179457611794611754565b500390565b6000826117b657634e487b7160e01b600052601260045260246000fd5b500490565b6020808252818101527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604082015260600190565b6020808252601c908201527f56657374696e672068617320616c726561647920737461727465642100000000604082015260600190565b60006020828403121561183957600080fd5b5051919050565b600081600019048311821515161561185a5761185a611754565b500290565b634e487b7160e01b600052603260045260246000fd5b600060001982141561188957611889611754565b5060010190565b600060ff821660ff84168060ff038211156118ad576118ad611754565b019392505050565b600081518084526020808501945080840160005b838110156118e857815160ff16875295820195908201906001016118c9565b509495945050505050565b6001600160a01b0383168152604060208201819052600090611917908301846118b5565b949350505050565b60006020828403121561193157600080fd5b815161123e816114b3565b600060ff821660ff81141561195357611953611754565b60010192915050565b6001600160a01b03848116825283166020820152606060408201819052600090611988908301846118b5565b9594505050505056fea26469706673582212208416fb3ee5b94b5cf16099e966401d715f7f0a226ac7262dec389163d57ce77164736f6c634300080b0033";

export class Vesting__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    nftAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Vesting> {
    return super.deploy(nftAddress, overrides || {}) as Promise<Vesting>;
  }
  getDeployTransaction(
    nftAddress: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(nftAddress, overrides || {});
  }
  attach(address: string): Vesting {
    return super.attach(address) as Vesting;
  }
  connect(signer: Signer): Vesting__factory {
    return super.connect(signer) as Vesting__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): VestingInterface {
    return new utils.Interface(_abi) as VestingInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Vesting {
    return new Contract(address, _abi, signerOrProvider) as Vesting;
  }
}