package org.example.api_sh.controller;

import org.example.api_sh.dto.BossDto;
import org.example.api_sh.entity.Boss;
import org.example.api_sh.service.BossService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bosses")
@CrossOrigin(origins = {"https://gw-sh.net"})
public class BossAdminController {

    private final BossService bossService;

    public BossAdminController(BossService bossService) {
        this.bossService = bossService;
    }

    @PostMapping
    public Boss create(@RequestBody Boss boss) {
        return bossService.createBoss(boss);
    }

    @PostMapping("/import")
    public List<Boss> importBosses(@RequestBody List<BossDto> bossDtos) {
        return bossService.importBosses(bossDtos);
    }

    @PutMapping("/{id}")
    public Boss update(@PathVariable Integer id, @RequestBody Boss boss) {
        return bossService.updateBoss(id, boss);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        bossService.deleteBoss(id);
    }
}

