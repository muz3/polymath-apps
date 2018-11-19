export const validWhitelistCsv = `\
Address,Sale Lockup,Purchase Lockup,KYC/AML Expiry,Can Buy From STO,Exempt From % Ownership,Is Accredited,Non-Accredited Limit
0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1,1/1/22,6/4/24,1/1/21,TRUE,TRUE,TRUE,
0xd9f346Bf88cA2cb7e11B0106018DE80A0169764D,12/21/30,12/21/30,10/10/24,TRUE,,TRUE,
0xA1833Cd1a3e72335DE0b6945b5d83247F234d6e8,,,12/1/25,,TRUE,,1000
0x07889A89C6854bb4Ec445825E680255b17751192,,,12/1/25,TRUE,TRUE,,
`;

export const invalidWhitelistCsv = `\
Address,Sale Lockup,Purchase Lockup,KYC/AML Expiry,Can Buy From STO,Exempt From % Ownership,Is Accredited,Non-Accredited Limit
0x592E80AD45c08aba6C5bBd2d5C5A097BDF35Dee1,1/1/22,6/4/24,1/1/21,TRUE,TRUE,TRUE,
invalidAddress,12/21/30,12/21/30,10/10/24,TRUE,,TRUE,
0xA1833Cd1a3e72335DE0b6945b5d83247F234d6e8,,,12/1/25,,TRUE,,1000
0x07889A89C6854bb4Ec445825E680255b17751192,,,12/1/25,TRUE,TRUE,,
`;