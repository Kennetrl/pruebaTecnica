package uqai.prueba.controller;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uqai.prueba.model.TarjetaCredito;
import uqai.prueba.service.TarjetaCreditoService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tarjetas")
@CrossOrigin(origins = "*")
public class TarjetaCreditoController {

    private final TarjetaCreditoService service;

    public TarjetaCreditoController(TarjetaCreditoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<TarjetaCredito>> listar() {
        return ResponseEntity.ok(service.listar());
    }

    @PostMapping
    public ResponseEntity<TarjetaCredito> crear(@RequestBody TarjetaCredito tarjeta) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(tarjeta));
    }

    @PatchMapping("/{id}/bloquear")
    public ResponseEntity<TarjetaCredito> bloquear(@PathVariable Long id) {
        return ResponseEntity.ok(service.bloquear(id));
    }

    @PostMapping("/{id}/consumo")
    public ResponseEntity<TarjetaCredito> consumo(@PathVariable Long id,
                                                  @RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(service.registrarConsumo(id, body.get("monto")));
    }

    @PostMapping("/{id}/pago")
    public ResponseEntity<TarjetaCredito> pago(@PathVariable Long id,
                                               @RequestBody Map<String, BigDecimal> body) {
        return ResponseEntity.ok(service.registrarPago(id, body.get("monto")));
    }
}