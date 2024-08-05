package interknot.backend.likes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
class LoadLikeDatabase {
    private static final Logger log = LoggerFactory.getLogger(LoadLikeDatabase.class);

    @Bean
    CommandLineRunner initLikeDatabase(LikeRepository repository) {

        return args -> {};
    }    
}
