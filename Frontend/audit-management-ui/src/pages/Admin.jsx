import { useState } from 'react';
import { VscChevronRight } from 'react-icons/vsc';
import '../styles/admin.css';
import { useToast } from '../hooks/useToast';

export default function Admin() {
  const [userSearch, setUserSearch] =
    useState('');

const [groupSearch, setGroupSearch] =
    useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
const [showAddGroupModal, setShowAddGroupModal] = useState(false);
const [showEditUserModal, setShowEditUserModal] = useState(false);
const [showEditGroupModal, setShowEditGroupModal] = useState(false);
const [editingUser, setEditingUser] = useState(null);
const [editingGroup, setEditingGroup] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);
const [deleteType, setDeleteType] = useState(null);
const handleAddUser = async () => {
  try {

    console.log(newUser);

    // await createUser(newUser);

    setShowAddUserModal(false);

    handleUserSuccess();

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleAddGroup = async () => {
  try {

    console.log(newGroup);

    // await createGroup(newGroup);

    setShowAddGroupModal(false);

    handleGroupSuccess();

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleEditUser = async () => {
  try {

    console.log(editingUser);

    // await updateUser(editingUser);

    setShowEditUserModal(false);

    toast.success('User updated successfully!');

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleEditGroup = async () => {
  try {

    console.log(editingGroup);

    // await updateGroup(editingGroup);

    setShowEditGroupModal(false);

    toast.success('Group updated successfully!');

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleDeleteUser = async () => {
  try {

    console.log('Deleting user:', itemToDelete);

    // await deleteUser(itemToDelete.id);

    setShowDeleteConfirm(false);

    toast.success('User deleted successfully!');

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleDeleteGroup = async () => {
  try {

    console.log('Deleting group:', itemToDelete);

    // await deleteGroup(itemToDelete.id);

    setShowDeleteConfirm(false);

    toast.success('Group deleted successfully!');

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const [newUser, setNewUser] = useState({
  username: '',
  email: '',
  password: '',
  groupId: ''
});

const [newGroup, setNewGroup] = useState({
  name: ''
});

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@harrington.com',
      role: 'Super Admin',
      permission: 'Full Access (28/28)'
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane.smith@harrington.com',
      role: 'Senior Engineer/PC',
      permission: 'Full Access (28/28)'
    },
    {
      id: 3,
      name: 'Bob Johnson',
      email: 'bob.johnson@harrington.com',
      role: 'Field Engineer/Consultant',
      permission: 'Full Access (28/28)'
    }
  ];
    const groups = [
    {
        id: 1,
        name: 'Super Admin',
        description: 'Full system access'
    },
    {
        id: 2,
        name: 'Auditors',
        description: 'Audit management access'
    },
    {
        id: 3,
        name: 'Engineers',
        description: 'Field operations access'
    }
    ];
    const [activeTab, setActiveTab] = useState('users');
    const [selectedUser, setSelectedUser] = useState(users[0]);
    const [selectedGroup, setSelectedGroup] = useState(groups[0]);
  const filteredUsers = users.filter(x =>
    x.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    x.email.toLowerCase().includes(userSearch.toLowerCase())
  );
  const filteredGroups = groups.filter(
    x =>
        x.name
            .toLowerCase()
            .includes(
                groupSearch.toLowerCase()
            )
);
const renderUserList = () => (
  <div className="user-list">

    {filteredUsers.map(user => (

      <div
        key={user.id}
        className={`user-card ${
          selectedUser?.id === user.id
            ? 'selected-card'
            : ''
        }`}
        onClick={() => setSelectedUser(user)}
      >
        <div>
          <div className="name-row">
            <h3>{user.name}</h3>

            <span className="permission-badge">
              {user.permission}
            </span>
          </div>

          <p className="email">{user.email}</p>

          <p className="role">{user.role}</p>
        </div>

        {selectedUser?.id === user.id && (
          <button className="menu-btn">
            <VscChevronRight />
          </button>
        )}

      </div>

    ))}

  </div>
);
const renderGroupList = () => (
  <div className="user-list">

    {filteredGroups.map(group => (

      <div
        key={group.id}
        className={`user-card ${
          selectedGroup?.id === group.id
            ? 'selected-card'
            : ''
        }`}
        onClick={() => setSelectedGroup(group)}
      >
        <div>
          <h3 className="group-name-row">{group.name}</h3>

          <p className="role">
            {group.description}
          </p>
        </div>

        {selectedGroup?.id === group.id && (
          <button className="menu-btn">
            <VscChevronRight />
          </button>
        )}

      </div>

    ))}
  </div>
);
const renderUserPermissions = () => (
  <div className="permission-panel">

    <div className="permission-header">

      <div className="permission-user-info">
        <h2>{selectedUser?.name}</h2>

        <p className="user-email">
          {selectedUser?.email}
        </p>

        <div className="user-meta">
          <span>{selectedUser?.role}</span>

          <span className="permission-badge">
            {selectedUser?.permission}
          </span>
        </div>
      </div>

      <div className="permission-actions">

        <button className="reset-btn">
          Reset All
        </button>

        <button
          className="menu-btn"
          onClick={() =>
            setShowPermissionMenu(!showPermissionMenu)
          }
        >
          ⋮
        </button>

        {showPermissionMenu && (
          <div className="menu-dropdown">
            <button onClick={() => {
              setEditingUser({...selectedUser});
              setShowEditUserModal(true);
              setShowPermissionMenu(false);
            }}>Edit User</button>
            <button className="danger" onClick={() => {
              setItemToDelete(selectedUser);
              setDeleteType('user');
              setShowDeleteConfirm(true);
              setShowPermissionMenu(false);
            }}>
              Delete User
            </button>
          </div>
        )}

      </div>

    </div>

    <div className="permission-divider" />

    {/* Permissions Grid Here */}
    <div className="permission-grid">
      
    </div>

  </div>
);
const [showPermissionMenu, setShowPermissionMenu] = useState(false);
const [groupPermissions] = useState([]);
const [showGroupMenu, setShowGroupMenu] = useState(false);

const renderGroupPermissions = () => (

    <div className="permission-panel">

        <div className="permission-header">

            <div className="permission-user-info">

                <h2>
                    {selectedGroup?.name}
                </h2>

                <p className="user-email">
                    {selectedGroup?.description}
                </p>

                <div className="user-meta">

                    <span>
                        Group
                    </span>

                    <span className="permission-badge">
                        {
                            groupPermissions.reduce(
                                (total, module) =>
                                    total +
                                    module.permissions.length,
                                0
                            )
                        }
                        {' '}
                        Permissions
                    </span>

                </div>

            </div>

            <div className="permission-actions">

                <button className="add-user-btn">
                    Edit Permissions
                </button>

                <button
                    className="menu-btn"
                    onClick={() =>
                        setShowGroupMenu(
                            !showGroupMenu
                        )
                    }
                >
                    ⋮
                </button>

                {showGroupMenu && (
                    <div className="menu-dropdown">

                        <button onClick={() => {
                          setEditingGroup({...selectedGroup});
                          setShowEditGroupModal(true);
                          setShowGroupMenu(false);
                        }}>
                            Edit Group
                        </button>

                        <button>
                            Add Members
                        </button>

                        <button className="danger" onClick={() => {
                          setItemToDelete(selectedGroup);
                          setDeleteType('group');
                          setShowDeleteConfirm(true);
                          setShowGroupMenu(false);
                        }}>
                            Delete Group
                        </button>

                    </div>
                )}

            </div>

        </div>

        <div className="permission-divider"></div>

        <div className="permission-grid">

            {groupPermissions.map(module => (

                <div
                    key={module.moduleName}
                    className="permission-section"
                >

                    <h3>
                        {module.moduleName}
                        {' '}
                        <span className="module-count">
                            {module.permissions.length}/
                            {module.permissions.length}
                        </span>
                    </h3>

                    {module.permissions.map(permission => (

                        <label
                            key={permission}
                            className="permission-item"
                        >

                            <input
                                type="checkbox"
                                checked
                                readOnly
                            />

                            {permission}

                        </label>

                    ))}

                </div>

            ))}

        </div>

    </div>

);
 const handleUserSuccess = () => {
    toast.success('User created successfully!')
  }

  const handleGroupSuccess = () => {
    toast.success('Group created successfully!')
  }

  const handleError = () => {
    toast.error('Failed to save changes. Please try again.')
  }

  const toast = useToast();

  return (
    <div className="admin-page">

    <div className="admin-header">
      <h1>Admin</h1>

      {activeTab === 'users' ? (
  <button
    className="add-user-btn"
    onClick={() => setShowAddUserModal(true)}
  >
    + Add User
  </button>
) : (
  <button
    className="add-user-btn"
    onClick={() => setShowAddGroupModal(true)}
  >
    + Add Group
  </button>
)}
    </div>
    <div className="admin-tabs">

    <button
        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
        onClick={() => setActiveTab('users')}
    >
        User Management
    </button>

    <button
        className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
        onClick={() => setActiveTab('groups')}
    >
        Group Management
    </button>

    </div>

    <div className="management-container">

  {/* LEFT SIDE */}

  <div className="list-panel">

    <div className="panel-header">

      <div className="title-section">
        <h2>
          {activeTab === 'users'
            ? 'All Users'
            : 'All Groups'}
        </h2>

        <span className="user-count">
          {activeTab === 'users'
            ? users.length
            : groups.length}
        </span>
      </div>

      <button className="sort-btn">
        ⇅
      </button>

    </div>

    <div className="search-container">

  <div className="search-input-wrapper">

    <input
      type="text"
      placeholder={
        activeTab === 'users'
          ? 'Search users...'
          : 'Search groups...'
      }
      value={
        activeTab === 'users'
          ? userSearch
          : groupSearch
      }
      onChange={(e) => {
        if (activeTab === 'users') {
          setUserSearch(e.target.value);
        } else {
          setGroupSearch(e.target.value);
        }
      }}
    />

    {(
      activeTab === 'users'
        ? userSearch
        : groupSearch
    ) && (
      <button
        type="button"
        className="clear-search-btn"
        onClick={() => {
          if (activeTab === 'users') {
            setUserSearch('');
          } else {
            setGroupSearch('');
          }
        }}
      >
        ✕
      </button>
    )}

  </div>

</div>

    {activeTab === 'users'
      ? renderUserList()
      : renderGroupList()
    }

  </div>

  {/* RIGHT SIDE */}

  <div className="details-panel">

    {activeTab === 'users'
      ? renderUserPermissions()
      : renderGroupPermissions()
    }

  </div>

</div>
{showAddUserModal && (
  <div className="modal-overlay">

    <div className="modal-container">

      <div className="modal-header">
        <h2>Add User</h2>

        <button
          className="close-btn"
          onClick={() => setShowAddUserModal(false)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

        <label>
          Username
          <input
            type="text"
            value={newUser.username}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                username: e.target.value
              })
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={newUser.email}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                email: e.target.value
              })
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={newUser.password}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                password: e.target.value
              })
            }
          />
        </label>

        <label>
          Group
          <select
            value={newUser.groupId}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                groupId: e.target.value
              })
            }
          >
            <option value="">
              Select Group
            </option>

            {groups.map(group => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>
        </label>

      </div>

      <div className="modal-footer">

        <button
          className="secondary-btn"
          onClick={() => setShowAddUserModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleAddUser}
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}
{showAddGroupModal && (
  <div className="modal-overlay">

    <div className="modal-container">

      <div className="modal-header">
        <h2>Add Group</h2>

        <button
          className="close-btn"
          onClick={() => setShowAddGroupModal(false)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

        <label>
          Group Name

          <input
            type="text"
            value={newGroup.name}
            onChange={(e) =>
              setNewGroup({
                name: e.target.value
              })
            }
          />
        </label>
        <label>
          Group Description

          <input
            type="text"
            value={newGroup.description}
            onChange={(e) =>
              setNewGroup({
                description: e.target.value
              })
            }
          />
        </label>
    

      </div>

      <div className="modal-footer">

        <button
          className="secondary-btn"
          onClick={() => setShowAddGroupModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleAddGroup}
        >
          Save
        </button>

      </div>

    </div>

  </div>
)}
{showEditUserModal && (
  <div className="modal-overlay">

    <div className="modal-container">

      <div className="modal-header">
        <h2>Edit User</h2>

        <button
          className="close-btn"
          onClick={() => setShowEditUserModal(false)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

        <label>
          Username
          <input
            type="text"
            value={editingUser?.name || ''}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                username: e.target.value
              })
            }
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={editingUser?.email || ''}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                email: e.target.value
              })
            }
          />
        </label>
        <label>
          Group
          <select
            value={editingUser?.groupId || ''}
            onChange={(e) =>
              setEditingUser({
                ...editingUser,
                groupId: e.target.value
              })
            }
          >
            <option value="">
              Select Group
            </option>

            {groups.map(group => (
              <option
                key={group.id}
                value={group.id}
              >
                {group.name}
              </option>
            ))}
          </select>
        </label>

      </div>

      <div className="modal-footer">

        <button
          className="secondary-btn"
          onClick={() => setShowEditUserModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleEditUser}
        >
          Update
        </button>

      </div>

    </div>

  </div>
)}
{showEditGroupModal && (
  <div className="modal-overlay">

    <div className="modal-container">

      <div className="modal-header">
        <h2>Edit Group</h2>

        <button
          className="close-btn"
          onClick={() => setShowEditGroupModal(false)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body">

        <label>
          Group Name

          <input
            type="text"
            value={editingGroup?.name || ''}
            onChange={(e) =>
              setEditingGroup({
                ...editingGroup,
                name: e.target.value
              })
            }
          />
        </label>

        <label>
          Description

          <input
            type="text"
            value={editingGroup?.description || ''}
            onChange={(e) =>
              setEditingGroup({
                ...editingGroup,
                description: e.target.value
              })
            }
          />
        </label>

      </div>

      <div className="modal-footer">

        <button
          className="secondary-btn"
          onClick={() => setShowEditGroupModal(false)}
        >
          Cancel
        </button>

        <button
          className="primary-btn"
          onClick={handleEditGroup}
        >
          Update
        </button>

      </div>

    </div>

  </div>
)}
{showDeleteConfirm && (
  <div className="modal-overlay">

    <div className="modal-container delete-confirm-modal">

      <div className="modal-header">
        <h2>Confirm Delete</h2>

        <button
          className="close-btn"
          onClick={() => setShowDeleteConfirm(false)}
        >
          ✕
        </button>
      </div>

      <div className="modal-body delete-body">

        <p className="delete-message">
          Are you sure you want to delete this {deleteType}?
        </p>

        <p className="delete-warning">
          This action cannot be undone.
        </p>

      </div>

      <div className="modal-footer">

        <button
          className="secondary-btn"
          onClick={() => setShowDeleteConfirm(false)}
        >
          No, Cancel
        </button>

        <button
          className="danger-btn"
          onClick={() => {
            if (deleteType === 'user') {
              handleDeleteUser();
            } else if (deleteType === 'group') {
              handleDeleteGroup();
            }
          }}
        >
          Yes, Delete
        </button>

      </div>

    </div>

  </div>
)}

  </div>
  
);

}