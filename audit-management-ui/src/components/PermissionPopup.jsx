import { useState, useEffect } from 'react';
import { IoClose, IoLogoHtml5 } from 'react-icons/io5';
import { useToast } from '../hooks/useToast';
import '../styles/permission-popup.css';
import {
  getAvailableModules,
  createPermission,
  bulkCreatePermissions
} from '../services/permissionService';

export default function PermissionPopup({ isOpen, onClose = [], onAddPermissions }) {
  const [selectedModule, setSelectedModule] = useState('');
  //const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [addMode, setAddMode] = useState('single'); // 'single' or 'bulk'
  const [bulkPermissions, setBulkPermissions] = useState('');
  const [newPermissionName, setNewPermissionName] = useState('');
  const [newPermissionDescription, setNewPermissionDescription] = useState('');
  const [modules, setModules] = useState([]);


  const currentModule =
  modules?.find(
    m =>
      m.id.toString() ===
      selectedModule.toString()
  );

    const toast = useToast();

//   useEffect(() => {
//     setSelectedPermissions([]);
//   }, [selectedModule]);

const loadModules = async () => {
  try {

    const data =
      await getAvailableModules();

    setModules(data);

  }
  catch(error) {

    console.error(
      'Failed to load modules',
      error
    );

  }
};

useEffect(() => {
  loadModules();
}, []);

useEffect(() => {
  if (modules.length > 0) {
    setSelectedModule(modules[0].id);
  }
}, [modules]);
  const handleAddSingle = async () => {

  if (!newPermissionName.trim()) {
    alert('Permission name is required');
    return;
  }

  try {

    await createPermission({
      moduleId: Number(selectedModule),
      name: newPermissionName,
      description: newPermissionDescription
    });

    if (onAddPermissions) {
      await onAddPermissions();
    }
     toast.success('Permission added successfully!')

    setNewPermissionName('');
    setNewPermissionDescription('');

    handleClose();

  }
  catch(error) {

    console.error(
      'Failed to add permission',
      error
    );

    toast.error(
      error.response?.data ||
      'Unable to add permission'
    );
  }
};

  const handleAddBulk = async () => {

  const permissions =
    bulkPermissions
      .split('\n')
      .map(x => x.trim())
      .filter(x => x.length > 0);

  if (permissions.length === 0) {

    alert(
      'Please enter permissions'
    );

    return;
  }

  try {

    await bulkCreatePermissions({
      moduleId:
        Number(selectedModule),

      permissions
    });

    if (onAddPermissions) {
      await onAddPermissions();
    }
   toast.success('Permission(s) added successfully!')

    setBulkPermissions('');

    handleClose();

  }
  catch(error) {

    console.error(
      'Bulk add failed',
      error
    );

    toast.error(
      error.response?.data ||
      'Unable to add permissions'
    );
  }
};

  const handleClose = () => {
    //setSelectedPermissions([]);
    setBulkPermissions('');
    setAddMode('single');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="permission-popup-overlay" onClick={handleClose}>
      <div className="permission-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="permission-popup-header">
          <div>
            <h2>Add General Permission</h2>
            <p className="group-info">Add new permissions to the system that can be assigned to groups</p>
          </div>
          <button className="popup-close-btn" onClick={handleClose}>
            <IoClose size={24} />
          </button>
        </div>

        <div className="permission-popup-body">
          {/* Mode Selection */}
          <div className="mode-selector">
            <button
              className={`mode-btn ${addMode === 'single' ? 'active' : ''}`}
              onClick={() => setAddMode('single')}
            >
              Single Addition
            </button>
            <button
              className={`mode-btn ${addMode === 'bulk' ? 'active' : ''}`}
              onClick={() => setAddMode('bulk')}
            >
              Bulk Addition
            </button>
          </div>

          {/* Module Selection */}
                <div className="module-selector">
                    <label>Select Module</label>
                    <select
                            value={selectedModule}
                            onChange={(e) =>
                                setSelectedModule(
                                e.target.value
                                )
                            }
                            >
                            {modules.map(module => (
                                <option
                                key={module.id}
                                value={module.id}
                                >
                                {module.name}
                                </option>
                            ))}
                            </select>
                            </div>

          {/* Single Addition Mode */}
         {addMode === 'single' && currentModule && (
    <div className="permission-form-section">

        <div>
            <h5>
                Add Permission to {currentModule.name}
            </h5>
        </div>

        <div className="permission-form-content">

            <label className="group-info">
                Permission Name

                <input
                    type="text"
                    className="permission-input"
                    placeholder="e.g. Create Audit"
                    value={newPermissionName}
                    onChange={(e) =>
                        setNewPermissionName(e.target.value)
                    }
                />
            </label>

        </div>

    </div>
)}
          {/* Bulk Addition Mode */}
          {addMode === 'bulk' && (
            <div className="bulk-section">
              <label>Enter Permissions (one per line)</label>
              <textarea
                value={bulkPermissions}
                onChange={(e) => setBulkPermissions(e.target.value)}
                placeholder="Enter permissions separated by new lines&#10;Example:&#10;Create Audit&#10;View Audit&#10;Edit Audit"
                rows="8"
              />
              <div className="bulk-info">
                <p>Tip: Enter each permission on a new line</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="permission-popup-footer">
          <button className="cancel-btn" onClick={handleClose}>
            Cancel
          </button>
          <button
            className="add-btn"
            onClick={addMode === 'single' ? handleAddSingle : handleAddBulk}
            disabled={
                addMode === 'single'
                    ? !newPermissionName.trim()
                    : !bulkPermissions.trim()
                }
          >
            Add Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
