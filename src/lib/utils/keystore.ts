import { Wallet } from 'ethers';

/**
 * Given a private key and password, generate a keystore.
 * This function is slow (obviously) so avoid calling if it could
 * affect UX.
 * @param privateKey The private key to encrypt
 * @param password The password used to encrypt the private key
 */
export const generateKeystore = async (
  privateKey: string,
  password: string,
) => {
  return new Wallet(privateKey).encrypt(password);
};
