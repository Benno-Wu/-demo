package zust.itee.se.DAO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import zust.itee.se.Entity.Report;

@Repository
public interface ReportDAO extends CrudRepository<Report, Integer> {
    Report findById(int id);
}
