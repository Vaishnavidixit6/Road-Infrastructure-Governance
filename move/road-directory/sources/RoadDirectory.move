module RoadDirectory::RoadDirectory {
    use std::signer;
    use std::string::{String, Self};
    use std::vector;
    use aptos_framework::account;
    use aptos_framework::event;
    use aptos_framework::timestamp;

    // Structs
    struct Project has key, store {
        id: u64,
        name: String,
        description: String,
        location: String,
        contractor: String,
        status: String,
        budget: u64,
        progress: u64
    }

    struct Complaint has key, store {
        id: u64,
        project_id: u64,
        title: String,
        description: String,
        category: String,
        status: String,
        created_at: u64
    }

    // Events
    struct ProjectCreatedEvent has drop, store {
        project_id: u64,
        name: String
    }

    struct ComplaintSubmittedEvent has drop, store {
        complaint_id: u64,
        project_id: u64
    }

    // Global storage
    struct RoadDirectoryEvents has key {
        project_created_events: event::EventHandle<ProjectCreatedEvent>,
        complaint_submitted_events: event::EventHandle<ComplaintSubmittedEvent>,
        project_count: u64,
        complaint_count: u64
    }

    // Initialize module
    public entry fun initialize(account: &signer) {
        move_to(account, RoadDirectoryEvents {
            project_created_events: account::new_event_handle<ProjectCreatedEvent>(account),
            complaint_submitted_events: account::new_event_handle<ComplaintSubmittedEvent>(account),
            project_count: 0,
            complaint_count: 0
        });
    }

    // Project management functions
    public entry fun create_project(
        account: &signer,
        name: String,
        description: String,
        location: String,
        contractor: String,
        budget: u64
    ) acquires RoadDirectoryEvents {
        let events = borrow_global_mut<RoadDirectoryEvents>(@RoadDirectory);
        let project_id = events.project_count;
        events.project_count = events.project_count + 1;

        let project = Project {
            id: project_id,
            name,
            description,
            location,
            contractor,
            status: string::utf8(b"PLANNED"),
            budget,
            progress: 0
        };

        move_to(account, project);
        
        event::emit_event(&mut events.project_created_events, ProjectCreatedEvent {
            project_id,
            name: copy name
        });
    }

    // Complaint functions
    public entry fun submit_complaint(
        account: &signer,
        project_id: u64,
        title: String,
        description: String,
        category: String
    ) acquires RoadDirectoryEvents {
        let events = borrow_global_mut<RoadDirectoryEvents>(@RoadDirectory);
        let complaint_id = events.complaint_count;
        events.complaint_count = events.complaint_count + 1;

        let complaint = Complaint {
            id: complaint_id,
            project_id,
            title,
            description,
            category,
            status: string::utf8(b"PENDING"),
            created_at: timestamp::now_seconds()
        };

        move_to(account, complaint);
        
        event::emit_event(&mut events.complaint_submitted_events, ComplaintSubmittedEvent {
            complaint_id,
            project_id
        });
    }

    // View functions
    public fun get_project_count(): u64 acquires RoadDirectoryEvents {
        borrow_global<RoadDirectoryEvents>(@RoadDirectory).project_count
    }

    public fun get_complaint_count(): u64 acquires RoadDirectoryEvents {
        borrow_global<RoadDirectoryEvents>(@RoadDirectory).complaint_count
    }
}