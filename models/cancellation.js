const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

/**
 * Cancellation
 */

const CancellationSchema = new Schema({
    date: {
        type : Date,
    },
    teamId: {
        type: Schema.ObjectId,
        trim: true,
    },
    author: {
        type: String,
        trim: true,
    }
});

mongoose.model('Cancellation', CancellationSchema);

console.log("Loaded cancellation class")