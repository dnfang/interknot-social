package interknot.backend.messages;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadMessageDatabase {
    private static final Logger log = LoggerFactory.getLogger(LoadMessageDatabase.class);

    @Bean
    CommandLineRunner initMessageDatabase(MessageRepository repository) {

        return args -> {};
    }    
}
