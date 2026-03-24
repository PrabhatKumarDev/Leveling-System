// src/models/User.js
import mongoose from "mongoose";


const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 20,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        hunterName: {
            type: String,
            default: "E-Rank Hunter",
        },

        level: { type: Number, default: 1 },
        totalXp: { type: Number, default: 0 },
        currentXp: { type: Number, default: 0 },
        gold: { type: Number, default: 0 },
        statPoints: { type: Number, default: 0 },

        totalHabitsCompleted: { type: Number, default: 0 },
        totalQuestsCompleted: { type: Number, default: 0 },

        stats: {
            STR: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
            VIT: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
            INT: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
            FOC: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
            DIS: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
            CON: {
                level: { type: Number, default: 1 },
                xp: { type: Number, default: 0 },
            },
        },

        awakeningStage: {
            type: String,
            default: "Unawakened",
            enum: ["Unawakened", "Awakened", "Shadow Candidate", "Shadow Monarch"],
        },

        inventory: [
            {
                rewardId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Reward",
                },
                name: String,
                type: {
                    type: String,
                    enum: ["xp_boost", "gold_boost", "time_reward", "custom_reward"],
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
                durationMinutes: {
                    type: Number,
                    default: 0,
                },
            },
        ],

        activeRewardTimer: {
            name: { type: String, default: null },
            type: {
                type: String,
                enum: ["time_reward", "xp_boost", "gold_boost", null],
                default: null,
            },
            startedAt: { type: Date, default: null },
            endsAt: { type: Date, default: null },
        },
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            default: null,
        },
        jobUnlockedAt: {
            type: Date,
            default: null,
        },
        hasChosenJob: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("User", userSchema);