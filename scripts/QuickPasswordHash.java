import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class QuickPasswordHash {
    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String password = "Admin@123";
        String hash = encoder.encode(password);

        System.out.println("Generated BCrypt hash for 'Admin@123':");
        System.out.println(hash);
        System.out.println();
        System.out.println("SQL to update admin user:");
        System.out.println("UPDATE users SET password = '" + hash + "' WHERE username = 'admin';");
    }
}
