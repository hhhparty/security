
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class Test {
    final static String AES = "AES";
    final static int TAG_SIZE = 16;
    final static int IV_SIZE = 12;
    final static String CYPHER_TRANSFORM = "AES/GCM/NoPadding";
    final static SecureRandom random = new SecureRandom();

    public static void main(String[] args) throws Exception {
        // PLAIN TEXT
        String hello = "hello world";
        // Create a KEY
        KeyGenerator keygen;
        try {
            keygen = KeyGenerator.getInstance(AES);
            SecretKey aeskey = keygen.generateKey();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        
        // Alternative, create a key
        byte[] randomkey = new byte[32];
        random.nextBytes(randomkey);
        
        // Encrpytion
        String eHello = "";
        try {
            eHello = AESUtils.encrypt(randomkey, hello);
            System.out.println("Encrypted text: " + eHello);
        } catch (Exception e) {
            e.printStackTrace();
        }
        

        //Decryption
        String dHello = "";
        dHello = AESUtils.decrypt(randomkey, eHello);
        System.out.println("Decrypted text: " + dHello);
        
    }
}
