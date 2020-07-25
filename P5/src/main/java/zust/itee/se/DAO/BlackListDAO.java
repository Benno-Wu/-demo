package zust.itee.se.DAO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import zust.itee.se.Entity.BlackList;
import zust.itee.se.Entity.User;

import java.util.List;

@Repository
public interface BlackListDAO extends CrudRepository<BlackList, Integer> {
    List<BlackList> findAllByBlacker(User blacker);
}
