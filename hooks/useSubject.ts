import { useEffect, useState } from "react";
import { SubjectModel } from "@/app/api/model/model";
import { subjectService } from "@/app/api/services/subjectService";

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<SubjectModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Starting to fetch subjects...");
        
        const data = await subjectService.getSubjects();
        console.log("Service returned data:", data);
        console.log("Data type:", typeof data, "Is array:", Array.isArray(data));
        
        setSubjects(data);
        console.log("State set with data:", data);
      } catch (err: any) {
        console.error("Error fetching subjects:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchSubjects();
  }, []);

  // Debug log whenever subjects state changes
  useEffect(() => {
    console.log("Subjects state updated:", subjects);
  }, [subjects]);

  const addSubject = async (subjectData: Omit<SubjectModel, "id">) => {
    try {
      console.log("Adding subject:", subjectData);
      const newSubject = await subjectService.addSubject(subjectData);
      console.log("Subject added successfully:", newSubject);
      
      // Update local state to include the new subject
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
      
      return newSubject;
    } catch (error) {
      console.error("Error adding subject:", error);
      throw error;
    }
  };

  const updateSubject = async (updatedSubject: SubjectModel) => {
    try {
      console.log("Updating subject:", updatedSubject);
      const response = await subjectService.updateSubject(updatedSubject.id!.toString(), updatedSubject);
      console.log("Subject updated successfully:", response);
      
      // Update local state to reflect the changes
      setSubjects((prevSubjects) => 
        prevSubjects.map((subject) => 
          subject.id === updatedSubject.id ? response : subject
        )
      );
      
      return response;
    } catch (error) {
      console.error("Error updating subject:", error);
      throw error;
    }
  };

  const deleteSubjects = async (subjectIds: string[]) => {
    try {
      console.log("Deleting subjects:", subjectIds);
      
      // Delete all subjects in parallel
      const deletePromises = subjectIds.map(id => subjectService.deleteSubject(id));
      await Promise.all(deletePromises);
      
      console.log("Subjects deleted successfully");
      
      // Update local state to remove deleted subjects
      setSubjects((prevSubjects) => 
        prevSubjects.filter((subject) => !subjectIds.includes(subject.id))
      );
      
      return subjectIds;
    } catch (error) {
      console.error("Error deleting subjects:", error);
      throw error;
    }
  };

  return { subjects, setSubjects, loading, error, addSubject, updateSubject, deleteSubjects };
};
