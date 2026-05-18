package uqai.prueba.service;

import org.springframework.stereotype.Service;
import uqai.prueba.model.EstadoTarjeta;
import uqai.prueba.model.TarjetaCredito;
import uqai.prueba.repository.TarjetaCreditoRepository;

import java.math.BigDecimal;
import java.util.List;

@Service
public class TarjetaCreditoService {

    private final TarjetaCreditoRepository repository;

    public TarjetaCreditoService(TarjetaCreditoRepository repository) {
        this.repository = repository;
    }

    public TarjetaCredito crear(TarjetaCredito tarjeta) {
        tarjeta.setEstado(EstadoTarjeta.ACTIVA);
        tarjeta.setSaldoDisponible(tarjeta.getLimiteCredito());
        return repository.save(tarjeta);
    }

    public List<TarjetaCredito> listar() {
        return repository.findAll();
    }

    public TarjetaCredito bloquear(Long id) {
        TarjetaCredito tarjeta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarjeta no encontrada"));

        if (tarjeta.getEstado() == EstadoTarjeta.BLOQUEADA) {
            throw new RuntimeException("La tarjeta ya está bloqueada");
        }

        tarjeta.setEstado(EstadoTarjeta.BLOQUEADA);
        return repository.save(tarjeta);
    }

    public TarjetaCredito registrarConsumo(Long id, BigDecimal monto) {
        TarjetaCredito tarjeta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarjeta no encontrada"));

        if (tarjeta.getEstado() == EstadoTarjeta.BLOQUEADA) {
            throw new RuntimeException("No se puede operar sobre una tarjeta bloqueada");
        }

        if (monto.compareTo(tarjeta.getSaldoDisponible()) > 0) {
            throw new RuntimeException("Saldo insuficiente");
        }

        tarjeta.setSaldoDisponible(tarjeta.getSaldoDisponible().subtract(monto));
        return repository.save(tarjeta);
    }

    public TarjetaCredito registrarPago(Long id, BigDecimal monto) {
        TarjetaCredito tarjeta = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarjeta no encontrada"));

        if (tarjeta.getEstado() == EstadoTarjeta.BLOQUEADA) {
            throw new RuntimeException("No se puede operar sobre una tarjeta bloqueada");
        }

        BigDecimal nuevoSaldo = tarjeta.getSaldoDisponible().add(monto);

        if (nuevoSaldo.compareTo(tarjeta.getLimiteCredito()) > 0) {
            nuevoSaldo = tarjeta.getLimiteCredito();
        }

        tarjeta.setSaldoDisponible(nuevoSaldo);
        return repository.save(tarjeta);
    }
}