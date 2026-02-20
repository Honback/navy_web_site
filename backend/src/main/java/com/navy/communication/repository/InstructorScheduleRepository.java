package com.navy.communication.repository;

import com.navy.communication.model.InstructorSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface InstructorScheduleRepository extends JpaRepository<InstructorSchedule, Long> {

    @Query("SELECT s FROM InstructorSchedule s JOIN FETCH s.instructor WHERE s.instructor.id = :instructorId " +
           "ORDER BY s.scheduleDate ASC")
    List<InstructorSchedule> findByInstructorIdOrderByScheduleDateAsc(@Param("instructorId") Long instructorId);

    @Query("SELECT s FROM InstructorSchedule s JOIN FETCH s.instructor WHERE s.instructor.id = :instructorId " +
           "AND s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate " +
           "ORDER BY s.scheduleDate ASC")
    List<InstructorSchedule> findByInstructorIdAndDateRange(
        @Param("instructorId") Long instructorId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT DISTINCT s.instructor.id FROM InstructorSchedule s " +
           "WHERE s.scheduleDate = :date OR (s.endDate IS NOT NULL AND s.scheduleDate <= :date AND s.endDate >= :date)")
    List<Long> findBookedInstructorIdsByDate(@Param("date") LocalDate date);

    void deleteByRequestId(Long requestId);

    @Query("SELECT s FROM InstructorSchedule s JOIN FETCH s.instructor LEFT JOIN FETCH s.request " +
           "WHERE s.scheduleDate >= :startDate AND s.scheduleDate <= :endDate " +
           "ORDER BY s.scheduleDate ASC")
    List<InstructorSchedule> findAllByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
