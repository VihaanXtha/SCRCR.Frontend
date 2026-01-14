import React from 'react';

interface AdminFormActionsProps {
  onSaveDraft: () => void;
  onPublish: () => void;
  onCancel?: () => void;
  isEditing: boolean;
  isSubmitting?: boolean;
}

export const AdminFormActions: React.FC<AdminFormActionsProps> = ({ 
  onSaveDraft, 
  onPublish, 
  onCancel,
  isEditing, 
  isSubmitting = false 
}) => {
  return (
    <div className="admin-actions-row" style={{ display: 'flex', gap: '10px', marginTop: '16px', alignItems: 'center' }}>
      <button 
        className="btn sm" 
        onClick={onPublish} 
        disabled={isSubmitting}
      >
        {isEditing ? 'Update' : 'Publish'}
      </button>
      <button 
        className="btn sm" 
        style={{ background: '#6c757d', color: '#fff', borderColor: '#6c757d' }}
        onClick={onSaveDraft} 
        disabled={isSubmitting}
      >
        Save Draft
      </button>
      {onCancel && (
        <button 
          className="btn sm danger" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
      )}
    </div>
  );
};
