import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllPackages = async () => {
  return await prisma.package.findMany();
};

export const getPackageById = async (id) => {
  return await prisma.package.findUnique({
    where: { id: Number(id) },
  });
};

export const createPackage = async (data) => {
  return await prisma.package.create({
    data,
  });
};

export const updatePackage = async (id, data) => {
  return await prisma.package.update({
    where: { id: Number(id) },
    data,
  });
};

export const deletePackage = async (id) => {
  return await prisma.package.delete({
    where: { id: Number(id) },
  });
};