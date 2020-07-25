package zust.itee.se.DAO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import zust.itee.se.Entity.Picture;
import zust.itee.se.Entity.User;

import java.util.List;

@Repository
public interface PictureDAO extends JpaRepository<Picture, Integer> {
    List<Picture> findAllByUser(User user);

    Page<Picture> findAllByUser(User user, Pageable pageRequest);

    Page<Picture> findAllByUserIn(List<User> users, Pageable pageRequest);

    Page<Picture> findByNameLike(String name, Pageable pageRequest);
}
