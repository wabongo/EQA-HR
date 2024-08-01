package com.eqa.recruitment_service.job_post;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPost, Long> {

    List<JobPost> findByStatus(JobPost.JobStatus jobStatus);

    @Query("SELECT DISTINCT j.facility FROM JobPost j")
    List<String> findDistinctFacilities();

    @Query("SELECT DISTINCT j.jobType FROM JobPost j")
    List<String> findDistinctJobTypes();

    @Query("SELECT DISTINCT j.designation FROM JobPost j")
    List<String> findDistinctDesignations();

    @Query("SELECT j FROM JobPost j WHERE " +
            "(:department IS NULL OR j.facility = :department) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:designation IS NULL OR j.designation = :designation)")
    List<JobPost> searchJobs(@Param("department") String department,
                             @Param("jobType") String jobType,
                             @Param("designation") String designation);
}
    

