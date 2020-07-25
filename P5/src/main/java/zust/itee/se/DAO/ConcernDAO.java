package zust.itee.se.DAO;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import zust.itee.se.Entity.Concern;

@Repository
public interface ConcernDAO extends PagingAndSortingRepository<Concern,Integer> {
}
