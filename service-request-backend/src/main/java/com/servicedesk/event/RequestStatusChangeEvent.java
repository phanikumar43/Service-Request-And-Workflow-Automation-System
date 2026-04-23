package com.servicedesk.event;

import com.servicedesk.entity.ServiceRequest;
import lombok.Getter;
import org.springframework.context.ApplicationEvent;

/**
 * Event published when a request status changes
 */
@Getter
public class RequestStatusChangeEvent extends ApplicationEvent {

    private final ServiceRequest request;
    private final ServiceRequest.RequestStatus oldStatus;
    private final ServiceRequest.RequestStatus newStatus;

    public RequestStatusChangeEvent(Object source, ServiceRequest request,
            ServiceRequest.RequestStatus oldStatus, ServiceRequest.RequestStatus newStatus) {
        super(source);
        this.request = request;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
    }
}
