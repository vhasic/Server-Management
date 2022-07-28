package ba.unsa.etf.server.model;

import ba.unsa.etf.server.enumeration.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotEmpty;

/**
 * @author Vahidin Hasić
 * @version 1.0
 * @since 24.7.2022
 */

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Server {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @Column(unique = true)
    @NotEmpty(message = "Ip address cannot be empty or null")
    private String ipAddress;
    private String name;
    private String memory;
    private String type;
    private String imageURL;
    private Status status;
}
