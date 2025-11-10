import type { FC } from "react"
import type { AttrFormValues } from '../../models';

import { useEffect } from 'react';
import { useSchema } from '../../stores';
import { useForm } from 'react-hook-form';
import { AttributeTypes } from "../../models"

interface EdgeFormProps {
  tableId: string;
  attributeId?: string;
  onSubmit: () => void;
}

/*
const FIELD_TYPES = [
  'string', 'integer', 'text', 'boolean', 'date', 'datetime', 
  'timestamp', 'decimal', 'float', 'binary', 'json'
];
*/

const EdgeForm: FC<EdgeFormProps> = ({ tableId, attributeId, onSubmit }) => {
  const { schema, addAttribute, updateAttribute } = useSchema();
  
  // Find the current table and attribute if editing
  const table = schema.nodes.find(t => t.id === tableId);
  const attribute = attributeId 
    ? table?.attributes.find(a => a.id === attributeId) 
    : undefined;
  
  // Get all other tables for foreign key selection
  const otherTables = schema.nodes.filter(t => t.id !== tableId);
  
  // Set up form with default values
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AttrFormValues>({
    defaultValues: attribute ? {
      name: attribute.name,
      type: attribute.type,
      isRequired: attribute.isRequired,
      isUnique: attribute.isUnique,
      isPrimaryKey: attribute.isPrimaryKey,
      isForeignKey: attribute.isForeignKey,
      referencesTable: attribute.referencesTable,
      referencesField: attribute.referencesField,
      defaultValue: attribute.defaultValue,
    } : {
      name: '',
      type: 'string',
      isRequired: false,
      isUnique: false,
      isPrimaryKey: false,
      isForeignKey: false,
    }
  });
  
  // Watch values for conditional rendering
  const isForeignKey = watch('isForeignKey');
  const selectedType = watch('type');
  const isPrimaryKey = watch('isPrimaryKey');
  
  // Update requirements when primary key is toggled
  useEffect(() => {
    if (isPrimaryKey) {
      setValue('isRequired', true);
      setValue('isUnique', true);
    }
  }, [isPrimaryKey, setValue]);
  
  // Submit handler
  const handleFormSubmit = (data: AttrFormValues) => {
    if (attributeId) {
      updateAttribute(tableId, attributeId, data);
    } else {
      addAttribute(tableId, data);
    }
    onSubmit();
  };

  if (!table) return null;
  
  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h3 className="text-lg font-bold">
        {attributeId ? 'Edit Attribute' : 'Add Attribute'}
      </h3>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${errors.name ? 'input-error' : ''}`}
          {...register('name', { required: 'Name is required' })}
        />
        {errors.name && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.name.message}</span>
          </label>
        )}
      </div>
      
      <div className="form-control">
        <label className="label">
          <span className="label-text">Type</span>
        </label>
        <select 
          className="select select-bordered w-full"
          {...register('type', { required: true })}
        >
          {AttributeTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>
      
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('isPrimaryKey')}
          />
          <span className="label-text">Primary Key</span>
        </label>
      </div>
      
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('isRequired')}
            disabled={isPrimaryKey}
          />
          <span className="label-text">Required</span>
        </label>
      </div>
      
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('isUnique')}
            disabled={isPrimaryKey}
          />
          <span className="label-text">Unique</span>
        </label>
      </div>
      
      <div className="form-control">
        <label className="label cursor-pointer justify-start gap-2">
          <input
            type="checkbox"
            className="checkbox checkbox-primary"
            {...register('isForeignKey')}
            disabled={isPrimaryKey}
          />
          <span className="label-text">Foreign Key</span>
        </label>
      </div>
      
      {isForeignKey && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">References Table</span>
          </label>
          <select 
            className={`select select-bordered w-full ${errors.referencesTable ? 'select-error' : ''}`}
            {...register('referencesTable', { 
              required: isForeignKey ? 'Reference table is required' : false 
            })}
          >
            <option value="">Select a table</option>
            {otherTables.map(table => (
              <option key={table.id} value={table.id}>{table.name}</option>
            ))}
          </select>
          {errors.referencesTable && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.referencesTable.message}</span>
            </label>
          )}
        </div>
      )}
      
      {!isPrimaryKey && selectedType !== 'boolean' && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Default Value (optional)</span>
          </label>
          <input
            type="text"
            className="input input-bordered"
            {...register('defaultValue')}
            placeholder="Leave empty for no default"
          />
        </div>
      )}
      
      <div className="flex justify-end space-x-2 pt-4">
        <button 
          type="button"
          className="btn btn-ghost"
          onClick={onSubmit}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {attributeId ? 'Update' : 'Add'} Attribute
        </button>
      </div>
    </form>
  );
};

export { EdgeForm };