package interknot.backend.users;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadUserDatabase {

  private static final Logger log = LoggerFactory.getLogger(LoadUserDatabase.class);

  @Bean
  CommandLineRunner initUserDatabase(UserRepository repository) {

    return args -> {};
  }
}