package ba.unsa.etf.server.service;

import ba.unsa.etf.server.enumeration.Status;
import ba.unsa.etf.server.model.Server;
import ba.unsa.etf.server.repository.ServerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;
import java.util.List;
import java.util.Random;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerService {
    private final ServerRepository serverRepository;

    public Server create(Server server) {
        log.info("Creating server: {}", server);
        server.setImageURL(setServerImageURL());
        return serverRepository.save(server);
    }

    public Server get(Long id) {
        log.info("Getting server with id: {}", id);
        return serverRepository.findById(id).get();
    }

    public List<Server> list(int page, int limit) {
        log.info("Getting all servers");
        return serverRepository.findAll(PageRequest.of(page, limit)).toList();
    }

    public Server update(Server server) {
        log.info("Updating server: {}", server);
        return serverRepository.save(server); // if id exists, it will be updated, otherwise it will be created
    }

    public Boolean delete(Long id) {
        log.info("Deleting server with id: {}", id);
        serverRepository.deleteById(id); //if this is unsuccessful, it will throw exception
        return true;
    }

    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server with ip address: {}", ipAddress);
        Server server = serverRepository.findByIpAddress(ipAddress);
        if (server == null) {
            log.error("Server with ip address: {} does not exist", ipAddress);
            return null;
        }
        //establishing connection to remote server
        InetAddress inetAddress = InetAddress.getByName(ipAddress);
        server.setStatus(inetAddress.isReachable(5000) ? Status.SERVER_UP : Status.SERVER_DOWN);
        serverRepository.save(server);
        return server;
    }

    /*
     * This method is used to set random image URL for server.
     */
    private String setServerImageURL() {
        String[] imageNames = {"server1.png", "server2.png", "server3.png"};
        int random = new Random().nextInt(imageNames.length);
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("/api/v1/server/image/").path(imageNames[random]).toUriString();
        //example: http://localhost:8080/api/v1/server/image/server1.png //browser will automatically download this image
    }
}
