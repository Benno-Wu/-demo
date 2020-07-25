package zust.itee.se.Entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@Table(name = "blackList")
public class BlackList {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blacker_id")
    private User blacker;


    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "blacked_id")
    private User blacked;
}
