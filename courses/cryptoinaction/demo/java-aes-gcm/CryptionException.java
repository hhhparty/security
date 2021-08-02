import javax.crypto.AEADBadTagException;
import javax.crypto.BadPaddingException;
import javax.crypto.ExemptionMechanismException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.ShortBufferException;

/** 
 * 
 * 统一捕获异常 
 * 
 * @author leo 
 * @since 2020-12-31
 * @version 1.0
 */ 
public class CryptionException extends Exception{
    /**
     *
     */
    private static final long serialVersionUID = 1L;

    public CryptionException(String msg, Exception e){
        System.out.println(msg);
        if(e instanceof AEADBadTagException)
            System.out.println("AEADBadTagException");
        if(e instanceof BadPaddingException)
            System.out.println("BadPaddingException");
        if(e instanceof ExemptionMechanismException)
            System.out.println("ExemptionMechanismException");
        if(e instanceof IllegalBlockSizeException)
            System.out.println("IllegalBlockSizeException");
        if(e instanceof NoSuchPaddingException)
            System.out.println("NoSuchPaddingException");   
        if(e instanceof ShortBufferException)
            System.out.println("ShortBufferException");   
        
        //System.out.println(e.getMessage());
        e.printStackTrace();
    }
}
