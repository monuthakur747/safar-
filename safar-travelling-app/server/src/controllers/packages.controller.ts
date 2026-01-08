import { Request, Response } from 'express';
import { PackageService } from '../services/packages.service';

const packageService = new PackageService();

export class PackageController {
  async getAllPackages(req: Request, res: Response) {
    try {
      const packages = await packageService.getAllPackages();
      res.status(200).json(packages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving packages', error });
    }
  }

  async createPackage(req: Request, res: Response) {
    try {
      const newPackage = await packageService.createPackage(req.body);
      res.status(201).json(newPackage);
    } catch (error) {
      res.status(500).json({ message: 'Error creating package', error });
    }
  }

  async updatePackage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const updatedPackage = await packageService.updatePackage(id, req.body);
      res.status(200).json(updatedPackage);
    } catch (error) {
      res.status(500).json({ message: 'Error updating package', error });
    }
  }

  async deletePackage(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await packageService.deletePackage(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting package', error });
    }
  }
}