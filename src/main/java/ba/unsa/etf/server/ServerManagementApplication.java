package ba.unsa.etf.server;

import ba.unsa.etf.server.enumeration.Status;
import ba.unsa.etf.server.model.Server;
import ba.unsa.etf.server.repository.ServerRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@SpringBootApplication
public class ServerManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerManagementApplication.class, args);
    }

    @Bean
    CommandLineRunner run(ServerRepository serverRepository){
        return args -> {
            serverRepository.save(
                    new Server(null,"192.168.1.3", "Server 1", "4 GB", "Phone", "http://localhost:8080/api/v1/server/image/server1.png", Status.SERVER_UP)
            );
            serverRepository.save(
                    new Server(null,"192.168.1.10", "Server 2", "16 GB", "Web server", "http://localhost:8080/api/v1/server/image/server2.png", Status.SERVER_DOWN)
            );
            serverRepository.save(
                    new Server(null,"192.168.1.20", "Server 3", "64 GB", "Mail server", "http://localhost:8080/api/v1/server/image/server3.png", Status.SERVER_DOWN)
            );
        };
    }


    // This code can be reused for all servers
    // Resolving cors error
    // "http://localhost:3000" default for react frontend
    // "http://localhost:4200" default for angular frontend
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:4200"));
        corsConfiguration.setAllowedHeaders(Arrays.asList("Origin", "Access-Control-Allow-Origin", "Content-Type",
                "Accept", "Jwt-Token", "Authorization", "Origin, Accept", "X-Requested-With",
                "Access-Control-Request-Method", "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "Filename"));
        corsConfiguration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}