package zust.itee.se.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import zust.itee.se.DAO.ReportDAO;
import zust.itee.se.Entity.Report;

@Service
public class ReportService {
    @Autowired
    ReportDAO reportDAO;

    public Iterable<Report> allReports() {
        return reportDAO.findAll();
    }

    @Transactional
    public void addReport(Report report) {
        reportDAO.save(report);
    }

    @Transactional
    public void deleteReport(Report report) {
        reportDAO.delete(report);
    }

    public Report getReportById(int id) {
        return reportDAO.findById(id);
    }
}
