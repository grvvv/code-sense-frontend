// src/routes/_authenticated/project/new.tsx

import React, { useState } from 'react';
import { Upload, FolderOpen, Send, X } from 'lucide-react';
import { Card } from '@/components/atomic/card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/project/new')({
  component: RouteComponent,
});

interface ProjectFormData {
  projectName: string;
  preset: string;
  description: string;
  zipFile: File | null;
}

function RouteComponent() {
  const [formData, setFormData] = useState<ProjectFormData>({
    projectName: '',
    preset: '',
    description: '',
    zipFile: null
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Partial<ProjectFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof ProjectFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setFormData(prev => ({ ...prev, zipFile: file }));
        setErrors(prev => ({ ...prev, zipFile: undefined }));
      } else {
        setErrors(prev => ({ ...prev, zipFile: 'Please select a valid ZIP file' }));
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setFormData(prev => ({ ...prev, zipFile: file }));
        setErrors(prev => ({ ...prev, zipFile: undefined }));
      } else {
        setErrors(prev => ({ ...prev, zipFile: 'Please select a valid ZIP file' }));
      }
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, zipFile: null }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProjectFormData> = {};
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required';
    if (!formData.preset) newErrors.preset = 'Please select a preset';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.zipFile) newErrors.zipFile = 'Please upload a ZIP file';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const submitData = new FormData();
      submitData.append('projectName', formData.projectName);
      submitData.append('preset', formData.preset);
      submitData.append('description', formData.description);
      if (formData.zipFile) {
        submitData.append('zipFile', formData.zipFile);
      }
      console.log('Form submitted:', formData);
      alert('Form submitted successfully! Check console for data.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Project Name */}
          <div>
            <label className="block font-medium text-sm mb-1">Project Name</label>
            <input
              name="projectName"
              value={formData.projectName}
              onChange={handleInputChange}
              className={`w-full border rounded p-3 ${errors.projectName ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Enter project name"
            />
            {errors.projectName && <p className="text-sm text-red-600 mt-1">{errors.projectName}</p>}
          </div>

          {/* Preset */}
          <div>
            <label className="block font-medium text-sm mb-1">Preset</label>
            <input
              name="preset"
              value={formData.preset}
              onChange={handleInputChange}
              className={`w-full border rounded p-3 ${errors.preset ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            />
            {errors.preset && <p className="text-sm text-red-600 mt-1">{errors.preset}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-sm mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className={`w-full border rounded p-3 resize-none ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
              placeholder="Enter project description"
            />
            {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
          </div>

          {/* ZIP Upload */}
          <div>
            <label className="block font-medium text-sm mb-1">ZIP File</label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 ${isDragOver || errors.zipFile ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
            >
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {formData.zipFile ? (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <FolderOpen className="text-red-600" />
                    <div>
                      <p>{formData.zipFile.name}</p>
                      <p className="text-xs text-gray-500">{(formData.zipFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button type="button" onClick={removeFile} className="text-red-600 hover:text-red-800">
                    <X />
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <Upload className="mx-auto mb-2" />
                  Drag and drop or click to upload ZIP file
                </div>
              )}
            </div>
            {errors.zipFile && <p className="text-sm text-red-600 mt-1">{errors.zipFile}</p>}
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-700 hover:bg-red-800 text-white font-semibold py-3 rounded shadow"
            >
              <div className="flex items-center justify-center gap-2">
                
                Create Project
              </div>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
