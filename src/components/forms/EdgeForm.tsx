import type { FC } from "react"
import type { AttrFormValues } from '../../models';
import type { AttributeType } from '../../models';

import { useEffect } from 'react';
import { useSchema } from '../../stores';
import { useForm } from 'react-hook-form';
import { AttributeTypes, CountableAttrTypes } from "../../models"
import { ScalableAttrTypes, ScatterableAttrTypes } from "../../models"

interface EdgeFormProps {
  tableId: string;
  attributeId?: string;
  onSubmit: () => void;
}

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
      isNotNull: attribute.isNotNull,
      isUnique: attribute.isUnique,
      isPrimaryKey: attribute.isPrimaryKey,
      isForeignKey: attribute.isForeignKey,
      isUnsigned: attribute.isUnsigned,
      referencesTable: attribute.referencesTable,
      referencesField: attribute.referencesField,
      defaultValue: attribute.defaultValue,
      length: 'length' in attribute ? attribute.length : undefined,
      precision: 'precision' in attribute ? attribute.precision : undefined,
      scale: 'scale' in attribute ? attribute.scale : undefined,
    } : {
      name: '',
      type: 'string',
      isNotNull: false,
      isUnique: false,
      isPrimaryKey: false,
      isForeignKey: false,
      isUnsigned: false,
    }
  });

  // Watch values for conditional rendering
  const isForeignKey = watch('isForeignKey');
  const selectedType = watch('type');
  const isPrimaryKey = watch('isPrimaryKey');
  const referencesTable = watch('referencesTable');

  // Get the referenced table's attributes for field selection
  const referencedTable = referencesTable
    ? schema.nodes.find(t => t.id === referencesTable)
    : undefined;
  const referencedTableAttributes = referencedTable?.attributes || [];

  // Helper functions to determine which parameters to show
  const shouldShowLength = (type: AttributeType) => {
    return CountableAttrTypes.includes(type as any);
  };

  const shouldShowPrecision = (type: AttributeType) => {
    return ScatterableAttrTypes.includes(type as any) || ScalableAttrTypes.includes(type as any);
  };

  const shouldShowScale = (type: AttributeType) => {
    return ScalableAttrTypes.includes(type as any);
  };

  const shouldShowUnsigned = (type: AttributeType) => {
    // Numeric types that support unsigned in Yii/MySQL
    const numericTypes = [
      'tinyInteger', 'smallint', 'integer', 'bigint', 'binary',
      'decimal', 'money', 'float', 'double'
    ];
    return numericTypes.includes(type);
  };
  
  // Update requirements when primary key is toggled
  useEffect(() => {
    if (isPrimaryKey) {
      setValue('isNotNull', true);
      setValue('isUnique', true);
    }
  }, [isPrimaryKey, setValue]);
  
  // Submit handler
  const handleFormSubmit = (data: AttrFormValues) => {
    // Auto-detect type for foreign keys based on referenced field
    if (data.isForeignKey && data.referencesTable && data.referencesField) {
      const refTable = schema.nodes.find(t => t.id === data.referencesTable);
      const refField = refTable?.attributes.find(a => a.id === data.referencesField);

      if (refField) {
        // Map primary key types to their corresponding foreign key types
        if (refField.type === 'primaryKey') {
          data.type = 'integer';
        } else if (refField.type === 'bigPrimaryKey') {
          data.type = 'bigint';
        } else {
          data.type = refField.type;
        }
      }
    }

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
          disabled={isForeignKey}
        >
          {AttributeTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Length parameter for countable types (char, string, binary, integers, keys) */}
      {shouldShowLength(selectedType) && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Length</span>
          </label>
          <input
            type="number"
            className={`input input-bordered ${errors.length ? 'input-error' : ''}`}
            {...register('length', {
              value:0,
              valueAsNumber: true,
              validate: (value) => {
                if (value === undefined || value === null) return true;
                if (!Number.isInteger(value)) return 'Length must be an integer';
                return true;
              }
            })}
            placeholder="e.g., 255"
          />
          {errors.length && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.length.message}</span>
            </label>
          )}
        </div>
      )}

      {/* Precision parameter for scatterable types (datetime, time, timestamp, float, double) and scalable types (decimal, money) */}
      {shouldShowPrecision(selectedType) && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Precision</span>
          </label>
          <input
            type="number"
            className={`input input-bordered ${errors.precision ? 'input-error' : ''}`}
            {...register('precision', {
              value: 0,
              valueAsNumber: true,
              validate: (value) => {
                if (value === undefined || value === null) return true;
                if (!Number.isInteger(value)) return 'Precision must be an integer';
                return true;
              }
            })}
            placeholder="e.g., 10"
          />
          {errors.precision && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.precision.message}</span>
            </label>
          )}
        </div>
      )}

      {/* Scale parameter for scalable types (decimal, money) */}
      {shouldShowScale(selectedType) && (
        <div className="form-control">
          <label className="label">
            <span className="label-text">Scale</span>
          </label>
          <input
            type="number"
            className={`input input-bordered ${errors.scale ? 'input-error' : ''}`}
            {...register('scale', {
              value: 0,
              valueAsNumber: true,
              validate: (value) => {
                if (value === undefined || value === null) return true;
                if (!Number.isInteger(value)) return 'Scale must be an integer';
                return true;
              }
            })}
            placeholder="e.g., 2"
          />
          {errors.scale && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.scale.message}</span>
            </label>
          )}
        </div>
      )}

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
            {...register('isNotNull')}
            disabled={isPrimaryKey}
          />
          <span className="label-text">Not Null</span>
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

      {/* Unsigned checkbox for numeric types */}
      {shouldShowUnsigned(selectedType) && (
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="checkbox"
              className="checkbox checkbox-primary"
              {...register('isUnsigned')}
            />
            <span className="label-text">Unsigned</span>
          </label>
        </div>
      )}

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
        <>
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

          {referencesTable && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">References Field</span>
              </label>
              <select
                className={`select select-bordered w-full ${errors.referencesField ? 'select-error' : ''}`}
                {...register('referencesField', {
                  required: isForeignKey ? 'Reference field is required' : false
                })}
              >
                <option value="">Select a field</option>
                {referencedTableAttributes.map(attr => (
                  <option key={attr.id} value={attr.id}>{attr.name}</option>
                ))}
              </select>
              {errors.referencesField && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.referencesField.message}</span>
                </label>
              )}
            </div>
          )}
        </>
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