import { useState, useEffect } from 'react';
import { VscChevronRight } from 'react-icons/vsc';
import '../styles/admin.css';
import { useToast } from '../hooks/useToast';
import { addGroup, getGroups, updateGroup, deleteGroup } from '../services/groupService';
import { addUser, getUsers, updateUser, deleteUser } from '../services/userService';
import PermissionPopup from '../components/PermissionPopup';
import { getGroupPermissions, getModulesWithPermissions, updateGroupPermissions ,getUserPermissions,updateUserPermissions} from '../services/permissionService';

export default function Admin() {
const [userSearch, setUserSearch] =useState('');
const [groupSearch, setGroupSearch] =useState('');
const [showAddUserModal, setShowAddUserModal] = useState(false);
const [showAddGroupModal, setShowAddGroupModal] = useState(false);
const [showEditUserModal, setShowEditUserModal] = useState(false);
const [showEditGroupModal, setShowEditGroupModal] = useState(false);
const [showPermissionPopup, setShowPermissionPopup] = useState(false);
const [editingUser, setEditingUser] = useState(null);
const [editingGroup, setEditingGroup] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
const [itemToDelete, setItemToDelete] = useState(null);
const [deleteType, setDeleteType] = useState(null);
const [showPermissionMenu, setShowPermissionMenu] = useState(false);
const [showGroupMenu, setShowGroupMenu] = useState(false);
const [allModules, setAllModules] = useState([]);
const [groupPermissions, setGroupPermissions] = useState([]);
const [groupPermissionIds, setGroupPermissionIds] = useState([]);
const [showSortMenu, setShowSortMenu] = useState(false);
const [groupSortDirection, setGroupSortDirection] =useState('asc');
const [userPermissions, setUserPermissions] = useState([]);
const [userPermissionIds,setUserPermissionIds] = useState([]);



const loadModulesWithPermissions = async () => {

  try {

    const data =
      await getModulesWithPermissions();

    setAllModules(data);
  }
  catch (error) {

    console.error(
      'Failed to load modules',
      error
    );
  }
};
const loadUserPermissions = async (
  userId
) => {

  const data =
    await getUserPermissions(
      userId
    );

  setAllModules(data);

  const assignedIds =
    data
      .flatMap(x => x.permissions)
      .filter(x => x.isAssigned)
      .map(x => x.permissionId);

  setUserPermissionIds(
    assignedIds
  );
};
const handleUserPermissionToggle =
  async (permissionId) => {

    let updatedIds;

    if (
      userPermissionIds.includes(
        permissionId
      )
    ) {
      updatedIds =
        userPermissionIds.filter(
          x => x !== permissionId
        );
    }
    else {
      updatedIds = [
        ...userPermissionIds,
        permissionId
      ];
    }  

    await updateUserPermissions(
      selectedUser.id,
      updatedIds
    );

    setUserPermissionIds(
      updatedIds
    );
   const totalPermissions =
    allModules.reduce(
        (count, module) =>
            count + module.permissions.length,
        0
    );

setSelectedUser(prev => ({
    ...prev,
    permission:
        updatedIds.length === totalPermissions
            ? `Full Access (${updatedIds.length}/${totalPermissions})`
            : `Partial Access (${updatedIds.length}/${totalPermissions})`
}));
  
};
const loadGroupPermissions = async (groupId) => {
  try {

    const data = await getGroupPermissions(groupId);

    // For rendering the UI
    setGroupPermissions(data);

    // Extract only assigned permission ids
    const assignedIds = data
      .flatMap(module => module.permissions)
      .filter(permission => permission.isAssigned)
      .map(permission => permission.permissionId);

    setGroupPermissionIds(assignedIds);

  }
  catch (error) {
    console.error(
      'Failed to load group permissions',
      error.response.data
    );
  }
};


const handleAddUser = async () => {
  try {
    if (!newUser.username.trim()) {
      toast.error('User name is required');
      return;
    }

    await addUser({
      username: newUser.username,
      email: newUser.email,
      groupId: newUser.groupId,
    });

    const usersResponse = await getUsers();
    setUsers(usersResponse.data);
    setSelectedUser(usersResponse.data[0] || null);
    setNewUser({ username: '', email: '', groupId: '' });
    setShowAddUserModal(false);

    handleUserSuccess();

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleAddGroup = async () => {
  try {
    if (!newGroup.name.trim()) {
      toast.error('Group name is required');
      return;
    }

    await addGroup({
      name: newGroup.name,
      description: newGroup.description
    });

    const groupsResponse = await getGroups();
    setGroups(groupsResponse.data);
    setSelectedGroup(groupsResponse.data[0] || null);
    setNewGroup({ name: '', description: '' });
    setShowAddGroupModal(false);

    handleGroupSuccess();

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleEditUser = async () => {
  try {
    if (!editingUser?.username?.trim()) {
      toast.error('User name is required');
      return;
    }

    await updateUser(editingUser.id, editingUser);

    const usersResponse = await getUsers();
    setUsers(usersResponse.data);
    setSelectedUser(
      usersResponse.data.find(u => u.id === editingUser.id) ||
      usersResponse.data[0] ||
      null
    );

    setShowEditUserModal(false);
    toast.success('User updated successfully!');

  } catch (err) {
    console.error(err);
    handleError();
  }
};

const handleEditGroup = async () => {
  try {
    if (!editingGroup?.name?.trim()) {
      toast.error('Group name is required');
      return;
    }

    await updateGroup(editingGroup.id, editingGroup);

    const groupsResponse = await getGroups();
    setGroups(groupsResponse.data);
    setSelectedGroup(
      groupsResponse.data.find(g => g.id === editingGroup.id) ||
      groupsResponse.data[0] ||
      null
    );

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

    await deleteUser(itemToDelete.id);

    const usersResponse = await getUsers();
    setUsers(usersResponse.data);
    setSelectedUser(usersResponse.data[0] || null);

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

    await deleteGroup(itemToDelete.id);

    const groupsResponse = await getGroups();
    setGroups(groupsResponse.data);
    setSelectedGroup(groupsResponse.data[0] || null);

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
  name: '',
  description: ''
});

  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUser, setSelectedUser] = useState(users[0]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {

    if (!selectedGroup)
        return;

    loadModulesWithPermissions();
    loadGroupPermissions(selectedGroup.id);

}, [selectedGroup]); 
useEffect(() => {

    if (
        activeTab !== 'users' ||
        !selectedUser
    )
        return;

    const loadData = async () => {

        await loadModulesWithPermissions();

        await loadUserPermissions(
            selectedUser.id
        );
    };

    loadData();

}, [activeTab, selectedUser]);

useEffect(() => {

    if (activeTab !== 'users')
        return;

    const loadUsers = async () => {

        const response = await getUsers();

        setUsers(response.data);

        if (response.data.length > 0)
        {
            setSelectedUser(response.data[0]);
        }
    };

    loadUsers();

}, [activeTab]);

  useEffect(() => {

    if (activeTab !== 'groups')
        return;

    const loadGroups = async () => {

        const response = await getGroups();

        setGroups(response.data);

        if (response.data.length > 0)
        {
            setSelectedGroup(response.data[0]);
        }
    };

    loadGroups();

}, [activeTab]);

  // Load permissions when selected group changes
  useEffect(() => {

    if (
        activeTab !== 'groups' ||
        !selectedGroup
    )
        return;

    const loadData = async () => {

        await loadModulesWithPermissions();

        await loadGroupPermissions(
            selectedGroup.id
        );
    };

    loadData();

}, [activeTab, selectedGroup]);

  const filteredUsers = users.filter(x =>
    x.username.toLowerCase().includes(userSearch.toLowerCase()) ||
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
            <h3>{user.username}</h3>

            <span className="permission-badge">
              {user.permission}
            </span>
          </div>

          <p className="email">{user.email}</p>

          <p className="role">{user.groupName}</p>
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
        <h2>{selectedUser?.username}</h2>

        <p className="user-email">
          {selectedUser?.email}
        </p>

        <div className="user-meta">
          <span>{selectedUser?.groupName}</span>

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

            {allModules.map(module => (

                <div
                    key={module.moduleName}
                    className="permission-section"
                >
    <h3 className="module-header">

    <label className="module-checkbox">

        <input
            type="checkbox"
            checked={
                module.permissions.length > 0 &&
                module.permissions.every(permission =>
                    userPermissionIds.includes(permission.permissionId)
                )
            }
            onChange={() =>
                handleUserModuleToggle(module)
            }
        />

        <span>{module.moduleName}</span>

    </label>

    <span className="module-count">
        {
            module.permissions.filter(permission =>
                userPermissionIds.includes(permission.permissionId)
            ).length
        }
        /
        {module.permissions.length}
    </span>

</h3>

    <div className="permission-list">

        {module.permissions.map(permission => (
          

            <label
                key={permission.id}
                className="permission-item"
            >
                <input
                    type="checkbox"
                    checked={
                        userPermissionIds.includes(
                            permission.permissionId
                        )
                    }
                    onChange={() =>
                        handleUserPermissionToggle(
                            permission.permissionId
                        )
                    }
                /> 
                {permission.name}
            </label>

        ))}

    </div>

</div>

            ))}

        </div>  

  </div>
);


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
                        {groupPermissionIds.length} Permissions
                    </span>

                </div>

            </div>

            <div className="permission-actions">

                {/* <button className="reset-btn">
                    Reset All
                </button> */}

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

            {allModules.map(module => (

                <div
                    key={module.moduleName}
                    className="permission-section"
                >
    <h3 className="module-header">

    <label className="module-checkbox">

        <input
            type="checkbox"
            checked={
                module.permissions.length > 0 &&
                module.permissions.every(permission =>
                    groupPermissionIds.includes(permission.id)
                )
            }
            onChange={() =>
                handleModuleToggle(module)
            }
        />

        <span>{module.moduleName}</span>

    </label>

    <span className="module-count">
        {
            module.permissions.filter(permission =>
                groupPermissionIds.includes(permission.id)
            ).length
        }
        /
        {module.permissions.length}
    </span>

</h3>

    <div className="permission-list">

        {module.permissions.map(permission => (

            <label
                key={permission.id}
                className="permission-item"
            >
                <input
                    type="checkbox"
                    checked={
                        groupPermissionIds.includes(
                            permission.id
                        )
                    }
                    onChange={() =>
                        handlePermissionToggle(
                            permission.id
                        )
                    }
                />

                {permission.name}
            </label>

        ))}

    </div>

</div>

            ))}

        </div>   

    </div>

);
const handleUserModuleToggle = async (module) => {

    const modulePermissionIds =
        module.permissions.map(
            permission => permission.permissionId
        );

    const allSelected =
        modulePermissionIds.every(
            id => userPermissionIds.includes(id)
        );

    let updatedPermissionIds;

    if (allSelected) {

        // Remove all permissions under module
        updatedPermissionIds =
            userPermissionIds.filter(
                id =>
                    !modulePermissionIds.includes(id)
            );
    }
    else {

        // Add all permissions under module
        updatedPermissionIds = [
            ...new Set([
                ...userPermissionIds,
                ...modulePermissionIds
            ])
        ];
    }

    try {

        await updateUserPermissions(
            selectedUser.id,
            updatedPermissionIds
        );

        setUserPermissionIds(
            updatedPermissionIds
        );
        toast.success('Permission updated successfully!');
        await loadUserPermissions(
          selectedUser.id
          );
    }
    catch (error) {

        console.error(error.response.data);
    }
};
const handleModuleToggle = async (module) => {

    const modulePermissionIds =
        module.permissions.map(
            permission => permission.id
        );

    const allSelected =
        modulePermissionIds.every(
            id => groupPermissionIds.includes(id)
        );

    let updatedPermissionIds;

    if (allSelected) {

        // Remove all permissions under module
        updatedPermissionIds =
            groupPermissionIds.filter(
                id =>
                    !modulePermissionIds.includes(id)
            );
    }
    else {

        // Add all permissions under module
        updatedPermissionIds = [
            ...new Set([
                ...groupPermissionIds,
                ...modulePermissionIds
            ])
        ];
    }

    try {

        await updateGroupPermissions(
            selectedGroup.id,
            updatedPermissionIds
        );

        setGroupPermissionIds(
            updatedPermissionIds
        );
        toast.success('Permission updated successfully!');
        await loadGroupPermissions(
          selectedGroup.id
          );
    }
    catch (error) {

        console.error(error);
    }
};

const handlePermissionToggle = async (
  permissionId
) => {
  let updatedPermissionIds;

  if (
    groupPermissionIds.includes(permissionId)
  ) {
    updatedPermissionIds =
      groupPermissionIds.filter(
        x => x !== permissionId
      );
  }
  else {
    updatedPermissionIds = [
      ...groupPermissionIds,
      permissionId
    ];
  }

  await updateGroupPermissions(
    selectedGroup.id,
    updatedPermissionIds
  );
  toast.success('Permission updated successfully!')

  await loadGroupPermissions(
  selectedGroup.id
  );
};

 const handleUserSuccess = () => {
    toast.success('User created successfully!')
  }

  const handleGroupSuccess = () => {
    toast.success('Group created successfully!')
  }

  const handleError = () => {
    toast.error('Failed to save changes. Please try again.')
  }

  const handleUserSort = (type) => {

    const sortedUsers = [...users];

    switch (type) {

        case 'name':
            sortedUsers.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;

        case 'email':
            sortedUsers.sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            break;

        case 'group':
            sortedUsers.sort((a, b) =>
                a.groupName.localeCompare(b.groupName)
            );
            break;

        case 'permissions':
            sortedUsers.sort(
                (a, b) =>
                    b.permissionCount -
                    a.permissionCount
            );
            break;

        default:
            break;
    }

   // setUsers(sortedUsers);
    setShowSortMenu(false);
};
const handleGroupSort = () => {

    const sortedGroups = [...groups].sort((a, b) => {

        if (groupSortDirection === 'asc') {
            return a.name.localeCompare(b.name);
        }

        return b.name.localeCompare(a.name);
    });

    setGroups(sortedGroups);

    setGroupSortDirection(prev =>
        prev === 'asc'
            ? 'desc'
            : 'asc'
    );
};
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
  <div className="header-buttons-group">
    <button
      className="add-user-btn"
      onClick={() => setShowAddGroupModal(true)}
    >
      + Add Group
    </button>
    <button
      className="add-user-btn"
      onClick={() => setShowPermissionPopup(true)}
    >
      + Add Permission
    </button>
  </div>
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

      <div className="sort-container">

    <button
        className="sort-btn"
        onClick={() => {
            if (activeTab === 'users') {
                setShowSortMenu(prev => !prev);
            }
            else {
                handleGroupSort();
            }
        }}
    >
        ⇅
    </button>

    {activeTab === 'users' && showSortMenu && (
        <div className="sort-dropdown">

            <button
                onClick={() => handleUserSort('name')}
            >
                Sort by Name
            </button>

            <button
                onClick={() => handleUserSort('email')}
            >
                Sort by Email
            </button>

            <button
                onClick={() => handleUserSort('group')}
            >
                Sort by Group
            </button>

            <button
                onClick={() => handleUserSort('permissions')}
            >
                Sort by Permission Count
            </button>

        </div>
    )}

</div>

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
            required
            value={newGroup.name}
            onChange={(e) =>
              setNewGroup({
                ...newGroup,
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
              setNewGroup({...newGroup,
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
            value={editingUser?.username || ''}
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
            required
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

<PermissionPopup 
  isOpen={showPermissionPopup}
  onClose={() => setShowPermissionPopup(false)}
  onAddPermissions={loadModulesWithPermissions}
  existingPermissions={groupPermissions.flatMap(m => 
    m.permissions.map(p => ({ module: m.id, permission: p }))
  )}
/>

  </div>
  
);

}