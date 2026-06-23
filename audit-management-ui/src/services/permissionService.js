import api from './apiClient';

// Add permissions to a group
export const getAvailableModules = async () => {
  const response = await api.get(
    '/Permissions/modules'
  );

  return response.data;
};

export const createPermission = async (data) => {
  const response = await api.post(
    '/Permissions',
    data
  );

  return response.data;
};

export const bulkCreatePermissions = async (data) => {
  const response = await api.post(
    '/Permissions/bulk',
    data
  );

  return response.data;
};
// export const getGroupPermissions = async (groupId) => {
//   const response = await api.get(
//     `/groups/${groupId}/permissions`
//   );

//   return response.data;
// };
export const getModulesWithPermissions = async () => {
 
    const response = await api.get(
      '/Permissions/modules-with-permissions'
    );

    return response.data;
  
};
export const getGroupPermissions = async (groupId) => {
    const response = await api.get(
      `/Permissions/group/${groupId}/permissions`
    );

    return response.data;

};
export const updateGroupPermissions = async (
  groupId,
  permissionIds
) => {

  const response = await api.put(
    `/Permissions/group/${groupId}/permissions`,
    {
      permissionIds: permissionIds
    }
  );

  return response.data;
};

export const getUserPermissions = async (
  userId
) => {

  const response = await api.get(
    `/Permissions/user/${userId}/permissions`
  );

  return response.data;
};
export const updateUserPermissions = async (
  userId,
  permissionIds
) => {

  const response = await api.put(
    `/Permissions/user/${userId}/permissions`,
    {
      permissionIds
    }
  );

  return response.data;
};