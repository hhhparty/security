//package enn.icome.kernel.core.util;

import java.util.Base64;

import javax.crypto.Cipher;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.SecretKeySpec;



//import enn.icome.kernel.core.exception.CryptoException;

/**
 * AES工具
 * 
 * @author caowuchao
 * @since 2020年11月29日
 * @version 1.0
 */
public class AESUtils {

	/**
	 * AES加密
	 * 
	 * @param content
	 * @return
	 * @author caowuchao
	 * @throws CryptoException 
	 * @since 2020年11月29日
	 */
	public static String encrypt(byte[] keyBytes, String content) throws CryptionException {
		try {
			Cipher cipher = buildCipher(keyBytes, Cipher.ENCRYPT_MODE);
			byte[] encryptBytes = cipher.doFinal(content.getBytes());
			return Base64.getEncoder().encodeToString(encryptBytes);
		} catch (Exception e) {
			throw new CryptionException("AES加密异常", e);

		}
		
		
	}

	/**
	 * AES解密
	 * 
	 * @param content
	 * @return
	 * @author caowuchao
	 * @throws CryptoException 
	 * @since 2020年11月29日
	 */
	public static String decrypt(byte[] keyBytes, String content) throws CryptionException {
		try {
			Cipher cipher = buildCipher(keyBytes, Cipher.DECRYPT_MODE);
			return new String(cipher.doFinal(Base64.getDecoder().decode(content.getBytes())));
		} catch (Exception e) {
			throw new CryptionException("AES解密异常", e);
		}
	}

	private static Cipher buildCipher(byte[] keyBytes, int opmode) throws Exception {
		SecretKeySpec key = new SecretKeySpec(keyBytes, "AES");
		byte[] iv = new byte[12];
		Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
		cipher.init(opmode, key, new GCMParameterSpec(128, iv));
		return cipher;
	}

	public static void main(String[] args){

		System.out.println("Hello world.");
	}
}
