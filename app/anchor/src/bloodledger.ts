/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/bloodledger.json`.
 */
export type Bloodledger = {
  "address": "b1oodxpcTKPaXCUd5nnmTb8q85vRMfNmDLsqcqvUwwF",
  "metadata": {
    "name": "bloodledger",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addBloodUnitUsed",
      "discriminator": [
        187,
        14,
        229,
        126,
        118,
        216,
        126,
        206
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "institution"
          ]
        },
        {
          "name": "institution",
          "writable": true
        },
        {
          "name": "donor",
          "writable": true
        },
        {
          "name": "donorWallet"
        },
        {
          "name": "donorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "donorWallet"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "rewardsMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rewardsMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "bloodType",
          "type": "string"
        },
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "expired",
          "type": "bool"
        },
        {
          "name": "healthCheck",
          "type": "bool"
        }
      ]
    },
    {
      "name": "addDonation",
      "discriminator": [
        95,
        40,
        48,
        151,
        28,
        22,
        60,
        126
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true,
          "relations": [
            "institution"
          ]
        },
        {
          "name": "institution",
          "writable": true
        },
        {
          "name": "donor",
          "writable": true
        },
        {
          "name": "donorWallet"
        },
        {
          "name": "donorTokenAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "donorWallet"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "rewardsMint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "rewardsMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
        }
      ],
      "args": [
        {
          "name": "bloodType",
          "type": "string"
        },
        {
          "name": "id",
          "type": "string"
        },
        {
          "name": "expirationDate",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initConfig",
      "discriminator": [
        23,
        235,
        115,
        232,
        168,
        96,
        1,
        231
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "config",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "rewardsMint",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  119,
                  97,
                  114,
                  100,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "initInstitution",
      "discriminator": [
        30,
        36,
        45,
        134,
        204,
        23,
        230,
        212
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true,
          "relations": [
            "config"
          ]
        },
        {
          "name": "institution",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  116,
                  105,
                  116,
                  117,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "arg",
                "path": "name"
              }
            ]
          }
        },
        {
          "name": "institutionOwner",
          "writable": true
        },
        {
          "name": "config",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "name",
          "type": "string"
        }
      ]
    },
    {
      "name": "registerDonor",
      "discriminator": [
        170,
        42,
        14,
        170,
        45,
        210,
        127,
        107
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "donor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  111,
                  110,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bloodType",
          "type": "string"
        }
      ]
    },
    {
      "name": "setInventory",
      "discriminator": [
        116,
        230,
        45,
        88,
        196,
        220,
        254,
        84
      ],
      "accounts": [
        {
          "name": "owner",
          "signer": true,
          "relations": [
            "institution"
          ]
        },
        {
          "name": "institution",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "inventory",
          "type": {
            "array": [
              {
                "defined": {
                  "name": "inventory"
                }
              },
              8
            ]
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "config",
      "discriminator": [
        155,
        12,
        170,
        224,
        30,
        250,
        204,
        130
      ]
    },
    {
      "name": "donor",
      "discriminator": [
        43,
        66,
        58,
        146,
        38,
        217,
        15,
        26
      ]
    },
    {
      "name": "institution",
      "discriminator": [
        178,
        67,
        44,
        135,
        26,
        236,
        199,
        188
      ]
    }
  ],
  "events": [
    {
      "name": "bloodUnitUsedEvent",
      "discriminator": [
        167,
        78,
        235,
        127,
        104,
        166,
        40,
        130
      ]
    },
    {
      "name": "donationEvent",
      "discriminator": [
        43,
        125,
        2,
        48,
        193,
        140,
        25,
        191
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "unauthorized",
      "msg": "Unauthorized Access"
    },
    {
      "code": 6001,
      "name": "invalidBloodType",
      "msg": "Invalid Blood Type"
    },
    {
      "code": 6002,
      "name": "duplicatedBloodType",
      "msg": "Duplicated Blood Type"
    },
    {
      "code": 6003,
      "name": "insufficientStock",
      "msg": "Insufficient Blood Stock"
    }
  ],
  "types": [
    {
      "name": "bloodUnitUsedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "bloodType",
            "type": "string"
          },
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "expired",
            "type": "bool"
          },
          {
            "name": "healthCheck",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "config",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "rewardsMint",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "donationEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "timestamp",
            "type": "u64"
          },
          {
            "name": "bloodType",
            "type": "string"
          },
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "expirationDate",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "donor",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "bloodType",
            "type": "string"
          },
          {
            "name": "lastDonation",
            "type": "u64"
          },
          {
            "name": "numberDonation",
            "type": "u64"
          },
          {
            "name": "totalRewards",
            "type": "u64"
          },
          {
            "name": "healthCheck",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "institution",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "name",
            "type": "string"
          },
          {
            "name": "inventory",
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "inventory"
                  }
                },
                8
              ]
            }
          }
        ]
      }
    },
    {
      "name": "inventory",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bloodType",
            "type": "string"
          },
          {
            "name": "currentUnits",
            "type": "u64"
          },
          {
            "name": "used",
            "type": "u64"
          },
          {
            "name": "demand",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
