package UserSignControllerTest;

import org.junit.Test;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultHandlers;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.ycnet.mirage.MobileApplication;
import com.ycnet.mirage.test.MirageWebControllerTest;

@SpringApplicationConfiguration(classes = MobileApplication.class)
public class UserSignControllerTest extends MirageWebControllerTest{

	@Test
	@Rollback(false)
	public void testUserSignIn() throws Exception
	{
		this.mockMvc.perform(
				MockMvcRequestBuilders.post("/userSign/signIn")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"logonLanguage\":\"ZH_CN\",\"logonType\":\"1\",\"userRemoteIP\":\"158.58.34.151\",\"clientInfo\":\"MAC BOOK\",\"customerId\":\"ren\",\"netType\":\"04\",\"userType\":\"10\",\"password\":\"a4e9d0ee94ffd33c\",\"pageFlag\":\"0\",\"b2cFlag\":\"0\",\"orderInfo\":\"\",\"checkCode\":\"12325423\",\"presentNo\":\"\",\"broser\":\"FireFox\",\"sys\":\"1.0.0\",\"info\":\"MAC BOOK\",\"IPAddress\":\"192.68.70.16\",\"MACAddress\":\"192.68.70.16\",\"imageCodeKey\":\"UNCHECK\"}")
				).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().is(200));
	}
	
	/*@Test
	public void testQueryUserInfo() throws Exception
	{
		this.mockMvc.perform(
				MockMvcRequestBuilders.post("/userSign/queryUserInfo")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"SessionToken\":\"db4f0c48a569a5c56653766d228cd63a\"}")
				).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().is(200));
	}
	
	@Test
	public void testUserSignOff() throws Exception
	{
		this.mockMvc.perform(
				MockMvcRequestBuilders.post("/userSign/signOff")
				.contentType(MediaType.APPLICATION_JSON)
				.content("{\"test\":\"77f5ce53da94f7573cf8d33eadced573\",\"SessionToken\":\"77f5ce53da94f7573cf8d33eadced573\"}")
				).andDo(MockMvcResultHandlers.print()).andExpect(MockMvcResultMatchers.status().is(200));
	}*/
}
