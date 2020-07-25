package zust.itee.se.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.sql.Timestamp;

@Getter
@Setter
@Entity
@Table(name = "concern")
public class Concern {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

//    @Column(name = "concerner_id")
//    private int concernerId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "concerner_id")
    private User concerner;

//    @Column(name = "concerned_id")
//    private int concernedId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "concerned_id")
    private User concerned;

    @Column(name = "concern_time")
    private Timestamp concernTime;
}
