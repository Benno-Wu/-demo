package zust.itee.se.DAO;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import zust.itee.se.Entity.User;

import java.util.List;

@Repository
public interface UserDAO extends PagingAndSortingRepository<User, Integer> {
    User findUserByUserName(String userName);

    User findUserById(int id);

    List<User> findByUserNameLike(String userName);
}
