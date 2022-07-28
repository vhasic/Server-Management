package ba.unsa.etf.server.repository;

import ba.unsa.etf.server.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ServerRepository extends JpaRepository<Server, Long> {
    //Server is unique by ip address, so this method will return null or one server object
    @Query(value = "SELECT * FROM Server s WHERE s.ip_address = :ipAddress", nativeQuery = true)
    Server findByIpAddress(String ipAddress);
}
