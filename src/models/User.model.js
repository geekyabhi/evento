const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Registration = require("./Registration.model");

const UserSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Please enter name"],
			trim: true,
		},
		collegeId: {
			type: String,
			required: [true, "Please enter id"],
			unique: true,
			trim: true,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		branch: {
			type: String,
			trim: true,
		},
		section: {
			type: String,
			trim: true,
		},
		password: {
			type: String,
			require: [true, "Please enter the password"],
			trim: true,
			minlength: [5, "Min length is 5"],
			validate(value) {
				if (value.toLowerCase().includes("password")) {
					throw new Error("Cant contain password");
				}
			},
		},
		gender: {
			type: String,
			enum: ["Male", "Female", "None"],
			default: "None",
		},
		year: {
			type: Number,
			validate(value) {
				if (value < 1 || value > 4) {
					throw new Error("Enter valid year");
				}
			},
		},
		image: {
			type: String,
		},
		registeredIn: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Event",
			},
		],
		tokens: [{ type: String }],
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.matchPassword = async function (enteredPassword) {
	console.log(enteredPassword);
	return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
	try {
		const user = this;
		if (user.isModified("password")) {
			user.password = await bcrypt.hash(user.password, 10);
		}
		next();
	} catch (e) {
		console.log(`Error occured while hashing password ${e}`);
	}
});

UserSchema.pre("remove", async function (next) {
	try {
		const user = this;
		const registrations = await Registration.find({ user: user._id });
		for (let i = 0; i < registrations.length; i++) {
			await registrations[i].remove();
		}
		process.exit(0);
	} catch (e) {
		console.log(`Error occured while pre removing user ${e}`);
	}
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
