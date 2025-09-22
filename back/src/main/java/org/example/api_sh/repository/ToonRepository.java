package org.example.api_sh.repository;

import org.example.api_sh.entity.Toon;
import org.example.api_sh.entity.UserApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ToonRepository extends JpaRepository<Toon, Integer> {

    // Par entité (ok)
    List<Toon> findAllByOwner(UserApp owner);

    // Par id_user (JPQL explicite)
    @Query("select t from Toon t where t.owner.id_user = :ownerId")
    List<Toon> findAllByOwnerId(@Param("ownerId") Long ownerId);

    @Query("select t from Toon t where t.owner.id_user = :ownerId and t.name = :name")
    Optional<Toon> findByOwnerIdAndName(@Param("ownerId") Long ownerId, @Param("name") String name);

    @Query("select case when count(t) > 0 then true else false end " +
            "from Toon t where t.owner.id_user = :ownerId and t.name = :name")
    boolean existsByOwnerIdAndName(@Param("ownerId") Long ownerId, @Param("name") String name);
}
