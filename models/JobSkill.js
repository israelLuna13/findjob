import { DataTypes } from "sequelize";
import db from '../config/dba.js';
import Job from './Job.js';
import Skill from './Skills.js';

const JobSkill = db.define('job_skills', {
    jobId: {
        type: DataTypes.UUID,
        references: {
            model: Job,
            key: 'id'
        },
        allowNull: false
    },
    skillId: {
        type: DataTypes.INTEGER,
        references: {
            model: Skill,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: false
});

Job.belongsToMany(Skill, { through: JobSkill, foreignKey: 'jobId' });
Skill.belongsToMany(Job, { through: JobSkill, foreignKey: 'skillId' });

export default JobSkill;
