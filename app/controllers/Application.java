package controllers;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import models.User;
import play.data.validation.Email;
import play.data.validation.Equals;
import play.data.validation.MinSize;
import play.data.validation.Required;
import play.mvc.*;

/**
 *
 * @author ise57
 */
public class Application extends Controller {

	public static void index() {
		render();
	}

	// ~~~~~~~~~~~~ @Before interceptors
	@Before
	static void globals() {
		renderArgs.put("connected", connectedUser());
	}

	// ~~~~~~~~~~~~ Actions
	public static void register(@Required @Email String email, @Required @MinSize(5) String password, @Equals("password") String password2, @Required String name) {
		if (validation.hasErrors()) {
			validation.keep();
			params.flash();
			flash.error("Please correct these errors !");
			renderJSON("{\"status\": \"error\"}");
		}
		User user = new User(email, password, name);
		renderJSON("{\"status\": \"ok\"}");
	}

	public static void login() {
		renderJSON("{\"status\": \"error\"}");
	}

	public static void authenticate(String email, String password) {
		User user = User.connect(email, password);
		if (user == null) {
			flash.error("Bad email or bad password");
			flash.put("email", email);
			renderJSON("{\"status\": \"error\"}");
		}
		connect(user);
		renderJSON("{\"status\": \"ok\", \"name\": \"" + user + "\"}");
	}

	public static void logout() {
		flash.success("You've been logged out");
		session.clear();
		renderJSON("{\"status\": \"ok\"}");
	}

	// ~~~~~~~~~~~~ Some utils
	static void connect(User user) {
		session.put("logged", user.id);
	}

	static User connectedUser() {
		String userId = session.get("logged");
		return userId == null ? null : (User) User.findById(Long.parseLong(userId));
	}

	public static void userInfo(Long id) {
		User user = connectedUser();
		if (user == null) {
			renderJSON("{\"status\": \"error\"}");
		}
		Gson gson = new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create();
		String json = gson.toJson(user);
		renderJSON("{\"status\": \"ok\", \"user\": " + json + "}");
	}
}