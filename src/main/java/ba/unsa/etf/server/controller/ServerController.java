package ba.unsa.etf.server.controller;

import ba.unsa.etf.server.enumeration.Status;
import ba.unsa.etf.server.model.Response;
import ba.unsa.etf.server.model.Server;
import ba.unsa.etf.server.service.ServerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;

import static org.springframework.http.MediaType.IMAGE_PNG_VALUE;

@RestController
@RequestMapping("/api/v1/server")
@RequiredArgsConstructor
public class ServerController {
    private final ServerService serverService;

    @GetMapping("/list")
    public ResponseEntity<Response> getServers(@RequestParam("page") int page, @RequestParam("limit") int limit) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("servers", serverService.list(page, limit)))
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .message("Success")
                        .build()
        );
    }


    @GetMapping("/ping")
    public ResponseEntity<Response> pingServer(@RequestParam("ipAddress") String ipAddress) throws IOException {
        Server server = serverService.ping(ipAddress);
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("server", server))
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .message(server.getStatus() == Status.SERVER_UP ? "Ping success" : "Ping failed")
                        .build()
        );
    }

    @PostMapping("/save")
    public ResponseEntity<Response> saveServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("server", serverService.create(server)))
                        .statusCode(HttpStatus.CREATED.value())
                        .status(HttpStatus.CREATED)
                        .message("Server created")
                        .build()
        );
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Response> getServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("server", serverService.get(id)))
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .message("Server retrieved")
                        .build()
        );
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Response> deleteServer(@PathVariable("id") Long id) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("deleted", serverService.delete(id)))
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .message("Server deleted")
                        .build()
        );
    }

    @PutMapping("/update")
    public ResponseEntity<Response> updateServer(@RequestBody @Valid Server server) {
        return ResponseEntity.ok(
                Response.builder()
                        .timestamp(LocalDateTime.now())
                        .data(Map.of("server", serverService.update(server)))
                        .statusCode(HttpStatus.OK.value())
                        .status(HttpStatus.OK)
                        .message("Server updated")
                        .build()
        );
    }

    // Returns image of type png, everything else is returning json
    @GetMapping(path="/image/{filename}", produces = IMAGE_PNG_VALUE)
    public byte[] getImage(@PathVariable("filename") String filename) throws IOException {
        return Files.readAllBytes(Paths.get(System.getProperty("user.home") + "\\IdeaProjects\\Server Management\\src\\main\\java\\ba\\unsa\\etf\\server\\images\\" + filename));
    }

}
